import { Router } from "express";
const router=Router();
import { gameData } from "../data/index.js";
import { getpartComment } from "../data/comment.js";
import userMethods from "../data/user.js";
import validation from '../validations/gameValidation.js'
import ratingValidation from '../validations/individualRatingValidation.js'
import ratingData from '../data/individualRatings.js'

router.route('/:id').get(async (req,res)=>{
    try{
        req.params.id=validation.checkId(req.params.id);
    }catch(e){
        return res.status(400).json({error:e});
    }
    try{
        const game=await gameData.getGame(req.params.id);
        //Heng's comments loading
        const tempcomments=await getpartComment(req.params.id,0,3);
        for(var i=0;i<tempcomments.length;i++)
        {
            const userid=tempcomments[i].userID;
            const user=await userMethods.getUserById(userid);
            tempcomments[i].profilepath=user.avatar;
            tempcomments[i].username=user.userName;
            if(tempcomments[i]._id==req.session.user.userID)
                tempcomments[i].deletable=true;
            else
                tempcomments[i].deletable=false;
        }

        let reviews=game.individualRatings;

        
        //console.log(tempcomments);
        //return res.status(200).json(game)
        return res.render('gamedetails',{Titlename:'Game details',game:game,commentlist:tempcomments,reviews: reviews})
        // res.json({'test':'test'})
    }catch(e){
        return res.status(400).json({error:e})
    }
}
).delete(async (req,res)=>{
    try{
        req.params.id=validation.checkId(req.params.id);
    }catch(e){
        return res.status(400).json({error:e});
    }
    try{
        await gameData.removeGame(req.params.id);
        return res.status(200).json({'gameId':req.params.id,'deleted':true})
    }catch(e){
        return res.status(400).json({error:e})
    }
}).patch(async (req,res)=>{
    const updatedData=req.body;
    if(!updatedData|| Object.keys(updatedData).length === 0){
        return res.status(400).json({error:'There are no fields in the request body'})
    }
    try{
        req.params.id = validation.checkId(req.params.id);
        if(updatedData.releaseDate){updatedData.releaseDate=validation.checkDate(updatedData.releaseDate)}
        if(updatedData.name){updatedData.name=validation.checkString(updatedData.name,'Name')}
        if(updatedData.genre){updatedData.genre=validation.checkStringArray(updatedData.genre,'Genre')}
        if(updatedData.description){updatedData.description=validation.checkString(updatedData.description,'Description')}
        if(updatedData.systemRequirements){updatedData.systemRequirements=validation.checkStringArray(updatedData.systemRequirements,'System Requirements')}
        if(updatedData.ageRating){
            updatedData.ageRating=validation.checkString(updatedData.ageRating,'Age rating')
            updatedData.ageRating=validation.checkAgeRating(updatedData.ageRating,'Age rating')
        }
    }catch(e){
        return res.status(400).json({error: e});
    }
    try{
        //const {releaseDate,name,genre,description,systemRequirements,ageRating}=updatedData;
        const updatedGame=await gameData.updateGame(req.params.id,updatedData)
        res.status(200).json(updatedGame);
    }catch(e){
        res.status(400).json({error: e});
    }
}).post(async (req,res)=>{
        //Add reviews
        let errors=[];

        let review=req.body.reviewInput;
        try{
            review=ratingValidation.checkReview(review);
        }catch(e){
            errors.push(e);
        }
        let rating=parseInt(req.body.ratingInput);
        try{
            rating=ratingValidation.checkNumber(rating)
        }catch(e){
            errors.push(e);
        }
        const game=await gameData.getGame(req.params.id);
        let gameId=game._id;
        let userId=req.session.user.userId;

        let indReview=await ratingData.addRating(gameId,userId,review,rating)
        if(indReview){return res.send('Review added successfully')}
        
})

router.route('/:id/reviews').get(async (req,res)=>{
    try{
        req.params.id=validation.checkId(req.params.id);
    }catch(e){
        return res.status(400).json({error:e});
    }
    try{
        const game=await gameData.getGame(req.params.id);
        let reviews=game.individualRatings;
        return res.render('gameReviews',{Titlename:'Game Reviews',game:game,reviews: reviews})
    }catch(e){
        res.status(400).json({error: e});
    }
})

export default router;