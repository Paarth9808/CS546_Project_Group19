import { comment } from "../config/mongoCollection";
import { user } from "../config/mongoCollection";
import { games } from "../config/mongoCollection";
import { ObjectId } from "mongodb"
import { checkuserID,checkgameID,checkcommentID,checkcontent,checkphoto } from "../validation/commentValidation.js";

const createComment=async(
    userID,
    gameID,
    content,
    photo,
)=>{
    userID=checkuserID(userID);
    gameID=checkgameID(gameID);
    content=checkcontent(content);
    photo=checkphoto(photo);
    const userCollection=await user();
    const tempuser=await userCollection.findOne({_id:userID});
    if(tempuser==null)
        throw "user does not exist";
    const gameCollection=await games();
    const tempgame=await gameCollection.findOne({_id:gameID});
    if(tempgame==null)
        throw "game does not exist"; 
    const tempcomment={
        userID:userID,
        gameID:gameID,
        content:content,
        photo:photo,
        agree:0,
        report:0
    };
    const commentCollection=await comment();
    const insertInfo=await commentCollection.insertOne(tempcomment);
    if(!insertInfo.acknowledged||!insertInfo.insertedId)
        throw "Could not add comment";
    const newid=insertInfo.insertedId.toString();
    var userupdatedInfo=await userCollection.findOneAndUpdate({_id:new ObjectId(userID)},{$push:{reviewedIds:newid}},{ReturnDocument:'after'});
    if(userupdatedInfo.lastErrorObject.n === 0) {
        throw 'could not add reviewedIds successfully';
    }
    var gameupdatedInfo=await gameCollection.findOneAndUpdate({_id:new ObjectId(gameID)},{$push:{commentIds:newid}},{ReturnDocument:'after'});
    if(gameupdatedInfo.lastErrorObject.n === 0) {
        throw 'could not add reviewIDs successfully';
    }
}

const deleteComment=async(
    commentid
)=>{
    commentid=checkcommentID(commentid);
    const gameCollection=await games();
    const userCollection=await user();
    const commentCollection=await comment();
    var gameupdatedInfo=await gameCollection.findOneAndUpdate({_id:new ObjectId(commentid)},{$pull:{commentIds:commentid}},{returnDocument: 'after'});
    var userupdatedInfo=await userCollection.findOneAndUpdate({_id:new ObjectId(commentid)},{$pull:{reviewedIds:commentid}},{returnDocument: 'after'});
    var commentupdateInfo=await commentCollection.findOneAndDelete({_id:new Object(commentid)});
    if(gameupdatedInfo.lastErrorObject.n==0)
        throw "could not delete this comment in games db";
    if(userupdatedInfo.lastErrorObject.n==0)
        throw "could not delete this review in user db";
    if(commentupdateInfo.lastErrorObject.n==0)
        throw "could not delete this comment in comment db";
}

const updateComment=async(
    commentid,
    content,
    photo
)=>{
    commentid=checkcommentID(commentid);
    content=checkcontent(content);
    photo=checkphoto(photo);
    const commentCollection=await comment();
    const commentupdateInfo=await commentCollection.findOneAndUpdate({_id:new ObjectId(commentid)},{$set:{content:content,photo:photo}},{returnDocument: 'after'});
    if(commentupdateInfo.lastErrorObject.n==0)
        throw "could not update this comment in comment db";
}

const getCommentById=async(
    commentid
)=>{
    commentid=checkcommentID(commentid);
    const commentCollection=await comment();
    const tempcomment=await commentCollection.findOne({_id:new ObjectId(commentid)});
    if(tempcomment==null)
        throw "no comment is found";
    return tempcomment;
}

const agreeComment=async(
    commentid
)=>{
    commentid=checkcommentID(commentid);
    const commentCollection=await comment();
    const commentupdateInfo=await commentCollection.findOneAndUpdate({_id:new ObjectId(commentid)},{$inc:{agree:1}},{returnDocument: 'after'});
    if(commentupdateInfo.lastErrorObject.n==0)
        throw "could not update this comment in comment db";
}

const nonagreeComment=async(
    commentid
)=>{
    commentid=checkcommentID(commentid);
    const commentCollection=await comment();
    const commentupdateInfo=await commentCollection.findOneAndUpdate({_id:new ObjectId(commentid)},{$inc:{agree:-1}},{returnDocument: 'after'});
    if(commentupdateInfo.lastErrorObject.n==0)
        throw "could not update this comment in comment db";
}

const reportComment=async(
    commentid
)=>{
    commentid=checkcommentID(commentid);
    const commentCollection=await comment();
    const commentupdateInfo=await commentCollection.findOneAndUpdate({_id:new ObjectId(commentid)},{$inc:{report:1}},{returnDocument: 'after'});
    if(commentupdateInfo.lastErrorObject.n==0)
        throw "could not update this comment in comment db";
}
