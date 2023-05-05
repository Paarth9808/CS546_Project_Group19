import {Router} from 'express';
import formidable from 'formidable';
import {v4 as uuidv4} from 'uuid';
import fs from 'fs';
import Handlebars from 'handlebars';
import path from 'path';
import {createComment,deleteComment,getpartComment,getreportedComment,likeComment,dislikeComment,reportComment} from '../data/comment.js';
const router = Router();
const commentsource=fs.readFileSync(path.join('./views', 'partials', 'commentT.handlebars'));
const mycomment=Handlebars.compile(commentsource+"");

router.route('/getmore/:gameid/:index').get(async (req,res)=>{
  try{
    const userid=req.session.user.userId;
  }
  catch(e)
  {
    res.send("nologin");
    return;
  }
  try{
    const start=req.params.index;
    const gameid=req.params.gameid;
    //console.log(start);
    const newcomment=await getpartComment(gameid,Number(start),10);
    //console.log(newcomment);
    const htmllist=[];
    for(var i=0;i<newcomment.length;i++)
    {
      if(req.session.user.userId==newcomment[i].userID||req.session.user.role=="admin")
        newcomment[i].deletable=true;
      else
        newcomment[i].deletable=false;
      //console.log(mycomment({comment:newcomment[i]}));
      htmllist.push(mycomment({comment:newcomment[i]}));
    }
    res.send(htmllist);
  }
  catch(e)
  {
    res.status(400);
    res.send(e);
    console.log(e);
  }
})

router.route('/getreported/:gameid').get(async (req,res)=>{
  try{
    const start=req.params.index;
    const gameid=req.params.gameid;
    //console.log(start);
    const newcomment=await getreportedComment(gameid);
    //console.log(newcomment);
    const htmllist=[];
    for(var i=0;i<newcomment.length;i++)
    {
      newcomment[i].deletable=true;
      //console.log(mycomment({comment:newcomment[i]}));
      htmllist.push(mycomment({comment:newcomment[i]}));
    }
    res.send(htmllist);
  }
  catch(e)
  {
    res.status(400);
    res.send(e);
    console.log(e);
  }
})

router.route('/sendattitude').post(async (req,res)=>{
  console.log(req.body);
  try{
    const userid=req.session.user.userId;
  }
  catch(e)
  {
    res.send({data:"nologin"});
    return;
  }
  try
  {
    var id=req.body.id;
    const userId=req.session.user.userId;
    var id_split=id.split('-');
    if(id_split.length!=2)
      throw "invalid attitude message";
    console.log(id_split[1]);
    if(id_split[1]=='like')
    {
      const result=await likeComment(id_split[0],userId);
      res.send({data:result});
    }
    else if(id_split[1]=='dislike')
    {
      const result=await dislikeComment(id_split[0],userId);
      res.send({data:result});
    }
    else if(id_split[1]=='report')
    {
      const result=await reportComment(id_split[0],userId);
      //console.log(result);
      res.send({data:result});
    }
    else if(id_split[1]=="delete")
    {
      await deleteComment(id_split[0]);
      res.send({data:"deleted"});
    }
  }
  catch(e)
  {
    res.status(400);
    res.send(e);
    console.log(e);
  }
})
router.route("/sendcomment").post(async (req, res)=> {
    //console.log(req.body);
    try{
      const userid=req.session.user.userId;
    }
    catch(e)
    {
      res.send("nologin");
      return;
    }
    try{
    var form = new formidable.IncomingForm();
    form.encoding = 'utf-8';
    form.keepExtensions = true;
    form.maxFieldsSize = 8 * 1024 * 1024;
    //console.log(form)
    form.parse(req, async (err, fields, files)=> {
        //console.log(fields);
        //console.log(files);
        //console.log(...files);
        const text=fields.text;
        const gameid=fields.gameid;
        const pics=[];
        var picCount=0;
        for(var filename in files){
            //console.log(filename);
            const file =files[filename];
            const picName = uuidv4() ;
            const imgpath=path.join('./public', 'userfile', 'comments',picName+'.jpg');
            console.log(imgpath);
            fs.copyFile(file.filepath, imgpath, function (err) {
                if (err) {
                    console.log(err);
                  return res.send({ "error": 403, "message": "image save error！" });
                }
            });
            pics.push('/public/userfile/comments/' + picName+'.jpg');
            picCount++
        }
        if (picCount === Object.keys(files).length) {
            //res.send({ "picAddrs": pics, "fields": fields });
            console.log("transmission finished");
            console.log("text:"+text+",pict:"+picCount);  
            console.log(pics);
        }
        //console.log(req.session.user);
        //console.log(gameid);
        try{
          if(text.trim()==0&&pics.length==0)
            throw "empty content";
          const newcomment=await createComment(req.session.user.userId,gameid,text,pics);
          //console.log(newcomment);
          newcomment.deletable=true;
          res.send(mycomment({comment:newcomment}));
        }
        catch(e)
        {
          res.status(400);
          res.send(e);
        }
    });
  }
  catch(e)
  {
    res.status(400);
    res.send(e);
  }
});



export default router;