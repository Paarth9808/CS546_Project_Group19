import {Router} from 'express';
import formidable from 'formidable';
import {v4 as uuidv4} from 'uuid';
import fs from 'fs';
import Handlebars from 'handlebars';
import path from 'path';
import {createComment,deleteComment,getpartComment,likeComment,dislikeComment,reportComment} from '../data/comment.js';
const router = Router();
const commentsource=fs.readFileSync(path.join('./views', 'partials', 'commentT.handlebars'));
const mycomment=Handlebars.compile(commentsource+"");

router.route('/getmore/:index').get(async (req,res)=>{
  const start=req.params.index;
  console.log(start);
  const newcomment=await getpartComment(Number(start),10);
  console.log(newcomment);
  const htmllist=[];
  for(var i=0;i<newcomment.length;i++)
  {
    console.log(mycomment({comment:newcomment[i]}));
    htmllist.push(mycomment({comment:newcomment[i]}));
  }
  res.send(htmllist);
})

router.route('/sendattitude').post(async (req,res)=>{
  console.log(req.body);
  var id=req.body.id;
  var id_split=id.split('-');
  try
  {
    if(id_split.length!=2)
      throw "invalid attitude message";
    console.log(id_split[1]);
    if(id_split[1]=='like')
    {
      const like=await likeComment(id_split[0],"heng zhao");
      res.send({data:like});
    }
    else if(id_split[1]=='dislike')
    {
      const dislike=await dislikeComment(id_split[0],"heng zhao");
      res.send({data:dislike});
    }
    else if(id_split[1]=='report')
    {
      const report=await reportComment(id_split[0],"heng zhao");
      console.log(report);
      res.send({data:report});
    }
    else if(id_split[1]=="delete")
    {
      await deleteComment(id_split[0]);
      res.send({data:"deleted"});
    }
  }
  catch(e)
  {
    res.send(e);
    console.log(e);
  }
})
router.route("/sendcomment").post(async (req, res)=> {
    console.log(req.body);
    var form = new formidable.IncomingForm();
    form.encoding = 'utf-8';
    form.keepExtensions = true;
    form.maxFieldsSize = 8 * 1024 * 1024;
    console.log(form)
    form.parse(req, async (err, fields, files)=> {
        console.log(fields);
        console.log(files);
        const text=fields.text;
        const gameid=fields.gameid;
        const pics=[];
        var picCount=0;
        for(var filename in files){
            console.log(filename);
            const file =files[filename];
            const picName = uuidv4() ;
            const imgpath=path.join('./public', 'userfile', 'comments',picName+'.jpg');
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
        const newcomment=await createComment(req.session.user.userId,gameid,text,pics);
        //console.log(newcomment);
        res.send(mycomment({comment:newcomment}));
    });
});
export default router;