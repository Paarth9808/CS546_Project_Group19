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
        //if not logged in will be redirected to login page
        if(!req.session.user){return res.redirect('/login')} 
        let currentUser=req.session.user;
        //Heng's comments loading
        const tempcomments=await getpartComment(req.params.id,0,3);
        var isAdmin=false;
        if(req.session.user)
        {
            isAdmin=(req.session.user.userRole=="admin")
            for(var i=0;i<tempcomments.length;i++)
            {
                console.log(req.session.user);
                if(tempcomments[i].userID==req.session.user.userId||req.session.user.userRole=="admin")
                    tempcomments[i].deletable=true;
                else
                    tempcomments[i].deletable=false;
            }
        }

        let reviews=game.individualRatings;

        
        //console.log(tempcomments);
        //return res.status(200).json(game)
        return res.render('gamedetails',{Titlename:'Game details',game:game,commentlist:tempcomments,reviews: reviews,isAdmin:isAdmin,currentUser:currentUser})
        // res.json({'test':'test'})
    }catch(e){
        return res.status(400).render('error',{Titlename:'Error page',errorMessage:e})
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
        return res.status(200).render('gameDeleted',{Titlename:'Game deleted',message:'Game has been deleted successfully'})
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
})

router.route('/reviews/:id').get(async (req,res)=>{
    try{
        req.params.id=validation.checkId(req.params.id);
    }catch(e){
        return res.status(400).json({error:e});
    }
    try{
        const game=await gameData.getGame(req.params.id);
        let reviews=game.individualRatings;
        if(!req.session.user){return res.redirect('/login')}
        let currentUser=req.session.user;
        return res.render('gameReviews',{Titlename:'Game Reviews',game:game,reviews: reviews,currentUser:currentUser})
    }catch(e){
        res.status(400).json({error: e});
    }
}).post(async (req,res)=>{
    //Add reviews
    let errors=[];
    let isAdded=false;
    let rating="";
    let review=req.body.reviewInput;
    let game=undefined;
    let reviews=undefined
    let currentUser=undefined;
    try{
        review=ratingValidation.checkReview(review);
    }catch(e){
        errors.push(e);
    }
    try{
        rating=parseInt(req.body.ratingInput);
    }catch(e){
        errors.push(e)
    }
    try{
        rating=ratingValidation.checkNumber(rating,'Rating')
    }catch(e){
        errors.push(e);
    }
    if(errors.length>0){
        try{
        game=await gameData.getGame(req.params.id);
        let reviews=game.individualRatings;
        if(!req.session.user){return res.redirect('/login')}
        currentUser=req.session.user;
        return res.status(400).render('gameReviews',{Titlename:'Game Reviews',errors,hasErrors:true,game:game,reviews:reviews,currentUser:currentUser})
        }catch(e){
            return res.render(400).render('error',{Titlename:'Error page',errorMessage:e})
        }
        //return res.redirect('gameReviews')
    }
    try{
        // game=await gameData.getGame(req.params.id);
        // reviews=game.individualRatings;
        //let gameId=game._id;
        let gameId=req.params.id;
        if(!req.session.user){return res.redirect('/login')}
        currentUser=req.session.user;
        let userId=req.session.user.userId;

        

        let indReview=await ratingData.addRating(gameId,userId,review,rating)
        if(indReview){isAdded=true}
        game=await gameData.getGame(req.params.id);
        reviews=game.individualRatings;
        //return res.redirect('gameReviews')
        res.status(200).render('gameReviews',{Titlename:'Game Reviews',status:'Your review has been added',isAdded:isAdded,game:game,reviews:reviews,currentUser:currentUser})
    }catch(e){
        errors.push(e);
        //return res.redirect('gameReviews')
        game=await gameData.getGame(req.params.id);
        if(!req.session.user){return res.redirect('/login')}
        currentUser=req.session.user;
        reviews=game.individualRatings;
        return res.status(400).render('gameReviews',{Titlename:'Game Reviews',errors,hasErrors:true,game:game,reviews:reviews,currentUser:currentUser})
        //return res.status(400).render('gameReviews',{Titlename:'Error page',errorMessage:e})
    }

})

router.route('/reviews/:id/edit').get(async (req,res)=>{
    try{
        req.params.id=validation.checkId(req.params.id);
    }catch(e){
        return res.status(400).json({error:e});
    }
    try{
        const game=await gameData.getGame(req.params.id);
        let reviews=game.individualRatings;
        return res.render('editReview',{Titlename:'Edit Review',game: game})
        // if(!req.session.user){return res.redirect('/login')}
        // let currentUser=req.session.user;
        // return res.render('gameReviews',{Titlename:'Game Reviews',game:game,reviews: reviews,currentUser:currentUser})
    }catch(e){
        res.status(400).json({error: e});
    }

}).put(async (req,res)=>{
    let errors=[];
    let isAdded=false;
    let rating="";
    let review=req.body.reviewInput;
    let game=undefined;
    let reviews=undefined
    let currentUser=undefined;
    try{
        review=ratingValidation.checkReview(review);
    }catch(e){
        errors.push(e);
    }
    try{
        rating=parseInt(req.body.ratingInput);
    }catch(e){
        errors.push(e)
    }
    try{
        rating=ratingValidation.checkNumber(rating,'Rating')
    }catch(e){
        errors.push(e);
    }
    if(errors.length>0){
        return res.status(400).render('editReview',{Titlename:'Edit Review',errors,hasErrors:true,review:review,rating:rating})
    }
    try{
        let gameId=req.params.id;
        if(!req.session.user){return res.redirect('/login')}
        currentUser=req.session.user;
        let userId=currentUser.userId;
        let indReview=await ratingData.update(gameId,userId,review,rating)
        if(indReview){isAdded=true}
        game=await gameData.getGame(req.params.id);
        reviews=game.individualRatings;
        res.status(200).render('gameReviews',{Titlename:'Game Reviews',status:'Your review has been updated',isAdded:isAdded,game:game,reviews:reviews,currentUser:currentUser})
    }catch(e){
        errors.push(e);
        return res.status(400).render('editReview',{Titlename:'Edit Review',errors,hasErrors:true,review:review,rating:rating})
    }
})

router.route('/reviews/:id/delete').delete(async (req,res)=>{
    let id=undefined;
    let userId=undefined;
    let isDeleted=undefined;
    let errors=[]
    let game=undefined;
    let reviews=undefined
    let currentUser=undefined;

    try{
        id=req.params.id;
    }catch(e){
        res.status(400).render('error',{Titlename:'Error page',errorMessage:e})
    }
    try{
        if(!req.session.user){return res.redirect('/login')}
        currentUser=req.session.user;
        let userId=currentUser.userId;
        let deletedCount=await ratingData.remove(id,userId);
        if(deletedCount>0){isDeleted=true}
        game=await gameData.getGame(req.params.id);
        reviews=game.individualRatings;
        res.status(200).render('gameReviews',{Titlename:'Game Reviews',status:'Your review has been deleted',isDeleted:isDeleted,game:game,reviews:reviews,currentUser:currentUser})

    }catch(e){
        errors.push(e);
        game=await gameData.getGame(req.params.id);
        if(!req.session.user){return res.redirect('/login')}
        currentUser=req.session.user;
        reviews=game.individualRatings;
        return res.status(400).render('gameReviews',{Titlename:'Game Reviews',errors,hasErrors:true,game:game,reviews:reviews,currentUser:currentUser})
    }

    

})

export default router;