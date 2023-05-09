import { Router } from "express";
const router=Router();
import { gameData } from "../data/index.js";
import xss from "xss";


router.route('/').get(async (req,res)=>{
    try{
        let games=await gameData.getAllGameNames();
        res.status(200).render('compareGames',{Titlename:'Compare games',games:games})
    }catch(e){
        res.status(500).json('Internal server error')
    }
}).post(async (req,res)=>{
    let game1Name=xss(req.body.game1);
    let game2Name=xss(req.body.game2);
    let game1=undefined;
    let game2=undefined;
    let games=undefined;
    let errors=[]
    let game1Reviews=undefined;
    let game2Reviews=undefined;
    let currentUser=undefined;
    //validation pending
    try{
        games=await gameData.getAllGameNames();
    }catch(e){
        res.status(500).render('error',{Titlename:'Error page',errorMessage:e})
    }
    //if(!req.session.user){return res.redirect('/login')}
    if(req.session.user){currentUser=req.session.user;}
    try{
        game1=await gameData.getGameByName(game1Name);
        game1Reviews=game1.individualRatings;
    }catch(e){
        errors.push(e);
    }
    try{
        game2= await gameData.getGameByName(game2Name);
        game2Reviews=game2.individualRatings;
    }catch(e){
        errors.push(e);
    }
    res.render('compareGames',{Titlename:'Compare games',games:games,game1:game1,game2:game2,game1Reviews:game1Reviews,game2Reviews:game2Reviews,currentUser:currentUser})
})

export default router;