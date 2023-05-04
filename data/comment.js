import { comment } from "../config/mongoCollection.js";
import { user } from "../config/mongoCollection.js";
import { games } from "../config/mongoCollection.js";
import { ObjectId } from "mongodb";
import fs from 'fs';
import path from 'path';
import { checkuserID,checkgameID,checkcommentID,checkcontent,checkphoto } from "../validations/commentValidation.js";



{/* <img class="profile"  src={{comment.profilepath}}/>
</div>
<div>
    <span class="comment_name">{{comment.username}} </span>
    <span>{{comment.date}}</span>     
</div>
<div class="attitude">
    <div id={{concat comment._id "-like"}}>like {{like.length}}</div>
    <div id={{concat comment._id "-dislike"}}>dislike {{dislike.length}}</div>
    <div id={{concat comment._id "-report"}}>report {{report.length}}</div>
    {{#if comment.deletable}}
        <div id={{concat comment._id "-delete"}}>delete</div>
    {{/if}}
</div>
<div class="comment_text" >{{comment.content}}</div>
<div class="comment_pic">
    {{#if comment.photo.length}}
        {{#each comment.photo}} */}




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
    const tempuser=await userCollection.findOne({_id:new ObjectId(userID)});
    if(tempuser==null)
        throw "user does not exist";
    const gameCollection=await games();
    const tempgame=await gameCollection.findOne({_id:new ObjectId(gameID)});
    if(tempgame==null)
        throw "game does not exist"; 
    const now=new Date();
    const tempcomment={
        userID:userID,
        username:tempuser.userName,
        profilepath:tempuser.avatar,
        gameID:gameID,
        content:content,
        photo:photo,
        date:(now.getMonth()+1).toString().padStart(2,'0')+"/"+now.getDate()+"/"+now.getFullYear(),
        like:[],
        dislike:[],
        report:[],
    };
    const commentCollection=await comment();
    const insertInfo=await commentCollection.insertOne(tempcomment);
    console.log(insertInfo);
    if(!insertInfo.acknowledged||!insertInfo.insertedId)
        throw "Could not add comment";
    tempcomment._id=insertInfo.insertedId.toString();
    const newid=insertInfo.insertedId.toString();
    var userupdatedInfo=await userCollection.findOneAndUpdate({_id:new ObjectId(userID)},{$push:{reviewedIds:newid}},{ReturnDocument:'after'});
    if(userupdatedInfo.lastErrorObject.n === 0) {
        throw 'could not add reviewedIds successfully';
    }
    var gameupdatedInfo=await gameCollection.findOneAndUpdate({_id:new ObjectId(gameID)},{$push:{commentIds:newid}},{ReturnDocument:'after'});
    if(gameupdatedInfo.lastErrorObject.n === 0) {
        throw 'could not add reviewIDs successfully';
    }
    return tempcomment;
}


const getreportedComment=async(gameid)=>{
    const commentCollection=await comment();
    gameid=checkgameID(gameid);
    const res=commentCollection.find({gameID:gameid,report:{ $exists: true, $ne: [] } }).toArray();
    for(var i=0;i<res.length;i++)
        res[i]._id=res[i]._id.toString();
    return res;
}

const getpartComment=async(gameid,start,length)=>{
    const commentCollection=await comment();
    gameid=checkgameID(gameid);
    const res=commentCollection.find({gameID:gameid}).skip(start).limit(length).toArray();
    for(var i=0;i<res.length;i++)
        res[i]._id=res[i]._id.toString();
    return res;
}
const deleteComment=async(
    commentid
)=>{
    commentid=checkcommentID(commentid);
    const gameCollection=await games();
    const userCollection=await user();
    const commentCollection=await comment();
    var commentupdateInfo=await commentCollection.findOneAndDelete({_id:new ObjectId(commentid)});
    if(commentupdateInfo.lastErrorObject.n==0)
        throw "could not delete this comment in comment db";
    const pics=commentupdateInfo.value.photo;
    for(var i=0;i<pics.length;i++)
    {
        const dir=path.resolve();
        try{
        fs.unlinkSync(path.join(dir, pics[i]));
        }catch(e)
        {
            console.log("We can not find the target picture, maybe you have deleted it from the disk");
        }
    }
    const gameID=commentupdateInfo.value.gameID;
    const userID=commentupdateInfo.value.userID;
    console.log(gameID);
    var gameupdatedInfo=await gameCollection.findOneAndUpdate({_id:new ObjectId(gameID)},{$pull:{commentIds:commentid}},{returnDocument: 'after'});
    var userupdatedInfo=await userCollection.findOneAndUpdate({_id:new ObjectId(userID)},{$pull:{reviewedIds:commentid}},{returnDocument: 'after'});
    if(gameupdatedInfo.lastErrorObject.n==0)
        throw "could not delete this comment in games db";
    if(userupdatedInfo.lastErrorObject.n==0)
        throw "could not delete this review in user db";
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
    tempcomment._id=tempcomment._id.toString();
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
        {
            const commentupdateInfo=await commentCollection.findOneAndUpdate({_id:new ObjectId(commentid)},{$pull:{like:userid}},{returnDocument: 'after'});
            if(commentupdateInfo.lastErrorObject.n==0)
                throw "could not update this comment in comment db";
            return {
                like:commentupdateInfo.value.like.length,
                dislike:commentupdateInfo.value.dislike.length,
                report:commentupdateInfo.value.report.length
            };
        }
    }
    for(var i=0;i<tempcomment.dislike.length;i++)
    {
        if(tempcomment.dislike[i]==userid)
        {
            const commentupdateInfo=await commentCollection.findOneAndUpdate({_id:new ObjectId(commentid)},{$pull:{dislike:userid}},{returnDocument: 'after'});
            if(commentupdateInfo.lastErrorObject.n==0)
                throw "could not update this comment in comment db";
            break;
        }
    }
    const commentupdateInfo=await commentCollection.findOneAndUpdate({_id:new ObjectId(commentid)},{$push:{like:userid}},{returnDocument: 'after'});
    if(commentupdateInfo.lastErrorObject.n==0)
        throw "could not update this comment in comment db";
    return {
        like:commentupdateInfo.value.like.length,
        dislike:commentupdateInfo.value.dislike.length,
        report:commentupdateInfo.value.report.length
    };
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
        {
            const commentupdateInfo=await commentCollection.findOneAndUpdate({_id:new ObjectId(commentid)},{$pull:{dislike:userid}},{returnDocument: 'after'});
            if(commentupdateInfo.lastErrorObject.n==0)
                throw "could not update this comment in comment db";
            return {
                like:commentupdateInfo.value.like.length,
                dislike:commentupdateInfo.value.dislike.length,
                report:commentupdateInfo.value.report.length
            };
        }
    }
    for(var i=0;i<tempcomment.like.length;i++)
    {
        if(tempcomment.like[i]==userid)
        {
            const commentupdateInfo=await commentCollection.findOneAndUpdate({_id:new ObjectId(commentid)},{$pull:{like:userid}},{returnDocument: 'after'});
            if(commentupdateInfo.lastErrorObject.n==0)
                throw "could not update this comment in comment db";
            break;
        }
    }
    const commentupdateInfo=await commentCollection.findOneAndUpdate({_id:new ObjectId(commentid)},{$push:{dislike:userid}},{returnDocument: 'after'});
    if(commentupdateInfo.lastErrorObject.n==0)
        throw "could not update this comment in comment db";
    return {
        like:commentupdateInfo.value.like.length,
        dislike:commentupdateInfo.value.dislike.length,
        report:commentupdateInfo.value.report.length
    };
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
        {
            return -1;
        }
    }
    const commentupdateInfo=await commentCollection.findOneAndUpdate({_id:new ObjectId(commentid)},{$push:{report:userid}},{returnDocument: 'after'});
    if(commentupdateInfo.lastErrorObject.n==0)
        throw "could not update this comment in comment db";
    return {
        like:commentupdateInfo.value.like.length,
        dislike:commentupdateInfo.value.dislike.length,
        report:commentupdateInfo.value.report.length
    };
}


export{createComment,getpartComment,getreportedComment,deleteComment,updateComment,getCommentById,likeComment,dislikeComment,reportComment};