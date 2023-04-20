import { ObjectId } from "mongodb";
const checkuserID=(userID)=>{
    if(typeof userID!="string")
        throw "userID should be a string";
    userID=userID.trim();
    if(userID=="")
        throw "userID should not be empty spaces";
    if(!ObjectId.isValid(userID))
        throw "userID is not valid";
    return userID;
}

const checkgameID=(gameID)=>{
    if(typeof gameID!="string")
    throw "gameID should be a string";
    gameID=gameID.trim();
    if(gameID=="")
        throw "gameID should not be empty spaces";
    if(!ObjectId.isValid(gameID))
        throw "gameID is not valid";
    return gameID;
}

const checkcommentID=(commentID)=>{
    if(typeof commentID!="string")
        throw "commentID should be a string";
    commentID=commentID.trim();
    if(commentID=="")
        throw "commentID should not be empty spaces";
    if(!ObjectId.isValid(commentID))
        throw "commentID is not valid";
    return commentID;
}

const checkcontent=(content)=>{
    if(typeof content!="string")
        throw "content should be a string";
    return content.trim();
}

const checkphoto=(photo)=>{
    if(!(photo instanceof Array))
        throw "photo should be an Array of strings";
    for(var i=0;i<photo.length;i++)
        if(typeof photo[i]!="string")
            throw "every elements in photo should be string";
    return photo;
}

export{checkuserID,checkgameID,checkcommentID,checkcontent,checkphoto};