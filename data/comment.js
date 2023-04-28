import { comment } from "../config/mongoCollection.js";
import { user } from "../config/mongoCollection.js";
import { games } from "../config/mongoCollection.js";
import { ObjectId } from "mongodb"
import { checkuserID,checkgameID,checkcommentID,checkcontent,checkphoto } from "../validations/commentValidation.js";
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
    if(content==""&&photo.length==0)
        throw "comment should not be empty"
    const userCollection=await user();
    const tempuser=await userCollection.findOne({_id:userID});
    if(tempuser==null)
        throw "user does not exist";
    const gameCollection=await games();
    const tempgame=await gameCollection.findOne({_id:gameID});
    if(tempgame==null)
        throw "game does not exist"; 
    const now=new Date();
    const tempcomment={
        userID:userID,
        gameID:gameID,
        content:content,
        photo:photo,
        date:(now.getMonth()+1).toString().padStart(2,'0')+"/"+now.getDate()+"/"+now.getFullYear(),
        like:[],
        dislike:[],
        report:[]
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

const getpartComment=async(start,length)=>{
    const commentCollection=await comment();

    const res=commentCollection.find({}).skip(start).limit(length).toArray();
    return res;
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
    var commentupdateInfo=await commentCollection.findOneAndDelete({_id:new ObjectId(commentid)});
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
    const now=new Date();
    const now_string= now.getMonth().toString.padStart(2,'0')+"/"+now.getDay()+"/"+now.getFullYear();
    const commentupdateInfo=await commentCollection.findOneAndUpdate({_id:new ObjectId(commentid)},{$set:{content:content,photo:photo,date:now_string}},{returnDocument: 'after'});
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


const likeComment=async(
    commentid,userid
)=>{
    //console.log(commentid);
    commentid=checkcommentID(commentid);
    userid=checkuserID(userid);
    const commentCollection=await comment();
    const tempcomment=await commentCollection.findOne({_id:new ObjectId(commentid)});
    if(tempcomment==null)
        throw "no comment is found";
    for(var i=0;i<tempcomment.like.length;i++)
    {
        if(tempcomment.like[i]==userid)
            return -1;
    }
    const commentupdateInfo=await commentCollection.findOneAndUpdate({_id:new ObjectId(commentid)},{$push:{like:userid}},{returnDocument: 'after'});
    if(commentupdateInfo.lastErrorObject.n==0)
        throw "could not update this comment in comment db";
    return commentupdateInfo.value.like.length;
}

const dislikeComment=async(
    commentid,userid
)=>{
    //console.log(commentid);
    commentid=checkcommentID(commentid);
    userid=checkuserID(userid);
    const commentCollection=await comment();
    const tempcomment=await commentCollection.findOne({_id:new ObjectId(commentid)});
    if(tempcomment==null)
        throw "no comment is found";
    for(var i=0;i<tempcomment.dislike.length;i++)
    {
        if(tempcomment.dislike[i]==userid)
            return -1;
    }
    const commentupdateInfo=await commentCollection.findOneAndUpdate({_id:new ObjectId(commentid)},{$push:{dislike:userid}},{returnDocument: 'after'});
    if(commentupdateInfo.lastErrorObject.n==0)
        throw "could not update this comment in comment db";
    return commentupdateInfo.value.dislike.length;
}

const reportComment=async(
    commentid,userid
)=>{
    //console.log(commentid);
    commentid=checkcommentID(commentid);
    userid=checkuserID(userid);
    const commentCollection=await comment();
    const tempcomment=await commentCollection.findOne({_id:new ObjectId(commentid)});
    if(tempcomment==null)
        throw "no comment is found";
    for(var i=0;i<tempcomment.report.length;i++)
    {
        if(tempcomment.report[i]==userid)
            return -1;
    }
    const commentupdateInfo=await commentCollection.findOneAndUpdate({_id:new ObjectId(commentid)},{$push:{report:userid}},{returnDocument: 'after'});
    if(commentupdateInfo.lastErrorObject.n==0)
        throw "could not update this comment in comment db";
    return commentupdateInfo.value.report.length;
}


export{createComment,getpartComment,deleteComment,updateComment,getCommentById,likeComment,dislikeComment,reportComment};