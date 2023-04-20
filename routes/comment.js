import axios from "axios";
import * as fs from "fs";
import formidable from "formidable";
import {Router} from 'express';
import {createComment,deleteComment,updateComment,getCommentById,agreeComment,nonagreeComment,reportComment} from '../data/comment.js'
const router = Router();

router.route('/commenttest').get(async (req, res) => {
    //code here for GET
    res.render('comments', {Titlename:"Comments test"});
  });
router.route("/commenttest").post(async (req, res)=> {
    var form = new formidable.IncomingForm();
    form.encoding = 'utf-8';
    form.uploadDir = "../userfile/comments/";
    form.keepExtensions = true;
    form.maxFieldsSize = 4 * 1024 * 1024;
    form.parse(req, async (err, fields, files)=> {
        const userid=fields.userid
        const gameid=fields.gameid
        const text=fields.text;
        const pics=[];
        const picCount=0;
        for(var filename in files){
            const file =files[filename];
            const picName = uuid.v1() + path.extname(file.name);
            fs.rename(file.path, '..\\userfile\\comments\\' + picName, function (err) {
                if (err) {
                  return res.send({ "error": 403, "message": "image save error！" });
                }
                pics.push('../userfile/comments/' + picName);
                picCount++
            });
        }
        if (picCount === Object.keys(files).length) {
            res.send({ "picAddrs": pics, "fields": fields });
            await createComment(userid,gameid,text,pics)
        }
    });
});
export default router;