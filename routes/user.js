import { Router } from "express";
const router = Router();
import { userData } from "../data/index.js";
import validation from "../validations/userValidation.js";
import fs from "fs";

router
  .route("/:id")
  .get(async (req, res) => {
    try {
      req.params.id = validation.checkId(req.params.id);
    } catch (e) {
      return res.status(400).json({ error: e });
    }
    try {
      const user1 = await userData.getUserById(req.params.id);
      return res.render("userProfile", {
        avatar: user1.avatar,
        username: user1.userName,
        age: user1.age,
        email: user1.email,
      });
    } catch (e) {
      return res.status(404).json({ error: e });
    }
  }
  // delete user
  ).delete(async (req,res)=>{
    try{
        req.params.id=validation.checkId(req.params.id);
    }catch(e){
        return res.status(400).json({error:e});
    }
    try{
        await userData.deleteUser(req.params.id);
        return res.status(200).json({'userId':req.params.id,'deleted':true})
    }catch(e){
        return res.status(404).json({error:e})
    }
  })

// link to edit page
router
  .route("/:id/edit")
  .get(async (req, res) => {
    try {
      req.params.id = validation.checkId(req.params.id);
    } catch (e) {
      return res.status(400).json({ error: e });
    }
    res.render("editProfile");
  })
  .post(async (req, res) => {
    console.log("!edit profile");
    //age coming as a string so giving error have to see
    const { userName: userName, password: password, age: age } = req.body;
    console.log(req.body);
    if (userName && password && age) {
      try {
        console.log("!changing profile");
        // check oldPassword is correct else return
        let data = await userData.updateUser(
          req.params.id,
          userName,
          age,
          password
        ); // hash password
        if (data) {
          console.log("!changing profile", data);
          res.redirect("/" + req.params.id);
        }
      } catch (e) {
        console.log(e);
        res.status(404).json({ error: e });
      }
    }
  });

router
  .route("/:id/edit/avatar")
  .get(async (req, res) => {
    res.render("editAvatar");
  })
  .post(async (req, res) => {
    console.log("!edit profile");
    console.log(req.params.id);
    const { file: file } = req.body;
    if (req.files && req.files?.file.data)
      fs.writeFileSync(
        "./public/userimages/" +
          req.params.id +
          "." +
          req.files.file.name.split(".")[1],
        req.files.file.data,
        {
          flag: "w+",
        }
      );
  });

//role
router
  .route("/:id/edit/role")
  .get(async (req, res) =>{
    res.render("") // make page for this
  })

export default router;
