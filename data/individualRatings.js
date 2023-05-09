import validation from '../validations/individualRatingValidation.js'
//import { ObjectId } from "bson";
import { ObjectId } from 'mongodb';
import { games } from '../config/mongoCollection.js';
import { userData } from "../data/index.js";
import { user } from '../config/mongoCollection.js';
import gameData from '../data/games.js'
const addRating= async(
    gameId,
    userId,
    review,
    userRating
)=>{
    gameId=validation.checkId(gameId);
    userId=validation.checkId(userId);
    review=validation.checkReview(review);
    userRating=validation.checkNumber(userRating,'Rating')
    if(userRating<1||userRating>10){
        throw `Error: Rating should be between 1 and 10`
    }
    if(!Number.isInteger(userRating)){
        if(Math.floor(userRating * 100) % 10 !== 0){
          throw `Error: Rating should be limited to one decimal place`
        }
    }
    let userWhoRated=await userData.getUserById(userId)
    let userName=userWhoRated.userName;
    let newRating={
        _id: new ObjectId(),
        userId: userId,
        review: review,
        userRating: userRating,
        userName: userName
    }
    const gameCollection= await games();
    const game=await gameCollection.findOne({_id: new ObjectId(gameId)})
    if(game===null){throw `Game with id: ${gameId} not found`}
    let indRating=undefined;
    if(game){
        if(game.individualRatings.length!==0){
            indRating=game.individualRatings.findIndex(element=>element.userId===userId)
            if(indRating!==-1){
                // if(review){game.individualRatings[indRating].review=review}
                // if(userRating){game.individualRatings[indRating].userRating=userRating}
                throw `Review/rating for this user already exists, please edit the existing review`
            }else{
                game.individualRatings.push(newRating);
            }
        }else{
            game.individualRatings.push(newRating);
        }
    }
    const updatedInfo=await gameCollection.updateOne(
        {_id: new ObjectId(gameId)},
        {$set: {individualRatings: game.individualRatings}}
    )
    if(updatedInfo.modifiedCount===0){
        throw `Could not add review/rating`
    }

    const newGame=await gameCollection.findOne(
        {_id: new ObjectId(gameId)}
    )
    let reviewArray = game.individualRatings;
    let sum=0,count=0
    for(let i=0;i < reviewArray.length;i++){
        let obj=reviewArray[i];
        sum+=obj.userRating;
        count++
    }
    let updatedRating=sum/count;
    updatedRating=Number(updatedRating.toFixed(1))
    await gameCollection.updateOne(
        {_id: new ObjectId(gameId)},
        {$set: {rating: updatedRating}}
    )
    const userCollection = await user();
    let updatedUser=await userCollection.findOneAndUpdate({_id: new ObjectId(newRating.userId)},
    {$push:{ratedIds:gameId}},
    {ReturnDocument:'after'})
    if(updatedUser.lastErrorObject.n ===0){throw `RatedIds not updated successfully`}
    const newReview=get(gameId,userId)
    return newReview;
}

const getAll=async (gameId)=>{
    gameId=validation.checkId(gameId);
    const gameCollection=await games();
    let game= await gameCollection.findOne(
        {'_id':new ObjectId(gameId)},
        {projection:{_id:0,'individualRatings':1}}
    )
    if(game===null){throw `Game not found`}
    game.individualRatings.forEach(element => {
        element._id=element._id.toString();
    });
    return game.individualRatings;
    
}

const update=async(gameId,
    userId,
    review,
    userRating)=>{
        gameId=validation.checkId(gameId);
        userId=validation.checkId(userId);
        review=validation.checkReview(review);
        userRating=validation.checkNumber(userRating,'Rating')
        if(userRating<1||userRating>10){
            throw `Error: Rating should be between 1 and 10`
        }
        if(!Number.isInteger(userRating)){
            if(Math.floor(userRating * 100) % 10 !== 0){
              throw `Error: Rating should be limited to one decimal place`
            }
        }
        let userWhoRated=userData.getUserById(userId)
        let userName=userWhoRated.userName;
        // let newRating={
        //     _id: new ObjectId(),
        //     userId: userId,
        //     review: review,
        //     userRating: userRating
        // }
        const gameCollection= await games();
        const game=await gameCollection.findOne({_id: new ObjectId(gameId)})
        if(game===null){throw `Game with id: ${gameId} not found`}
        let indRating=undefined;
        if(game){
            if(game.individualRatings.length!==0){
                indRating=game.individualRatings.findIndex(element=>element.userId===userId)
                if(indRating!==-1){
                    if(review){game.individualRatings[indRating].review=review}
                    if(userRating){game.individualRatings[indRating].userRating=userRating}
                    if(userName){game.individualRatings[indRating].userName=userName}
                    
                }else{
                    throw `No ratings exist for this user`
                }
            }else{
                throw `No ratings exist for this user`
            }
        }

        const updatedInfo=await gameCollection.updateOne(
            {_id: new ObjectId(gameId)},
            {$set: {individualRatings: game.individualRatings}}
        )
        if(updatedInfo.modifiedCount===0){
            throw `Please change either the review or rating`
        }
    
        const newGame=await gameCollection.findOne(
            {_id: new ObjectId(gameId)}
        )
        let reviewArray = game.individualRatings;
        let sum=0,count=0
        for(let i=0;i < reviewArray.length;i++){
            let obj=reviewArray[i];
            sum+=obj.userRating;
            count++
        }
        let updatedRating=sum/count;
        updatedRating=Number(updatedRating.toFixed(1))
        await gameCollection.updateOne(
            {_id: new ObjectId(gameId)},
            {$set: {rating: updatedRating}}
        )
        const newReview=get(gameId,userId)

        return newReview;

    }


const get = async(gameId, userId)=>{
    gameId=validation.checkId(gameId);
    userId=validation.checkId(userId);
    const gameCollection= await games();
    let ratings=await getAll(gameId);
    let rating=undefined;
    if(ratings.length>0){
        rating=ratings.find(element=>element.userId===userId)
    }
    // let indRating=await gameCollection.findOne(
    //     {individualRatings.userId:}
    // )
    if(!rating){throw `You haven't reviewed this game yet`}
    return rating;
}

const remove=async (gameId,userId)=>{
    gameId=validation.checkId(gameId);
    userId=validation.checkId(userId);
    let review=await get(gameId,userId);
    let reviewId=review._id;
    const gameCollection= await games();
    let game=gameCollection.findOne(
        {'individualRatings._id': new ObjectId(reviewId)}
    )
    if(game===null){throw `Review not found`}
    //gameId=game._id.toString();
    const info=await gameCollection.updateOne(
        {'individualRatings._id': new ObjectId(reviewId)},
        {$pull:{individualRatings:{_id: new ObjectId(reviewId)}}}
    )
    if(info.modifiedCount===0){throw `Deletion failed`}
    let newGame=await gameCollection.findOne(
        {_id:new ObjectId(gameId)}
    )

    let reviewArray= newGame.individualRatings;
    let sum=0,count=0,newRating=0
    for(let i=0;i < reviewArray.length;i++){
        let obj=reviewArray[i];
        sum+=obj.userRating;
        count++
    }
    if(count==0){
        newRating=0
    }else{
        newRating=sum/count; //check for zero division
        newRating= Math.round(newRating*10)/10
    }
    await gameCollection.updateOne(
        {_id: new ObjectId(gameId)},
        {$set: {rating: newRating}}
    )
    const userCollection = await user();
    let updatedUser=await userCollection.findOneAndUpdate({_id: new ObjectId(userId)},
    {$pull:{ratedIds: gameId}},
    {ReturnDocument:'after'})
    if(updatedUser.lastErrorObject.n ===0){throw `RatedIds not updated successfully`}

    newGame=await gameCollection.findOne(
        {_id: new ObjectId(gameId)}
    )

    //return newGame
    return info.modifiedCount;

}
export default {addRating,getAll,get,remove,update}