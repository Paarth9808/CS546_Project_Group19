import {Router} from 'express';
import formidable from 'formidable';
import {v4 as uuidv4} from 'uuid';
import fs from 'fs';
import path from 'path';
import Handlebars from 'handlebars';
import {createComment,getpartComment} from '../data/comment.js';
const router = Router();
const commentsource=fs.readFileSync('./views/comment.handlebars');
const mycomment=Handlebars.compile(commentsource+"");
router.route('/commenttest').get(async (req, res) => {
    //code here for GET
    const tempcomments=await getpartComment(0,3);
    for(var i=0;i<tempcomments.length;i++)
    {
      tempcomments[i].profilepath='../userfile/profiles/heng.jpg';
      tempcomments[i].username='Heng';
    }
    //console.log(tempcomments);
    res.render('comments', {Titlename:"Comments test",commentlist:tempcomments});
  });

router.route('/commenttest/getmore/:index').get(async (req,res)=>{
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

router.route("/commenttest/test").post(async (req, res)=> {
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
        const pics=[];
        var picCount=0;
        for(var filename in files){
            console.log(filename);
            const file =files[filename];
            const picName = uuidv4() ;
            fs.copyFile(file.filepath, '.\\public\\userfile\\comments\\' + picName+'.jpg', function (err) {
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
        //const userid=req.session.user.userid;
        //get the gameid from the front end and name it as gameif
        //const newcomment=await createComment(userid,gameid,text,pics);
        const newcomment=await createComment("Heng Zhao","Need For Speed",text,pics);
        //console.log(newcomment);
        res.send(mycomment({comment:newcomment}));
    });
});
export default router;
