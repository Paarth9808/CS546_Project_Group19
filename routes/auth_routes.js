import {Router} from 'express';
const router = Router();
import validation from '../validations/authValidation.js'
import userDataFunctions from '../data/user.js'
import authFunction from '../data/auth.js'
import xss from 'xss';

router
    .route('/register')
    .get(async (req,res)=>{
        res.render('register',{Titlename:'Registration page'})
    })
    .post(async (req,res)=>{
        let user=req.body;
        let errors=[];
        try{
            user.emailAddressInput=xss(user.emailAddressInput)
            if(!user.emailAddressInput){throw `Email not provided`}
            user.emailAddressInput=xss(user.emailAddressInput);
            if(!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(user.emailAddressInput.trim())){throw `Invalid email id`}
        }catch(e){
            errors.push(e);
        }
        try{
            user.userNameInput=xss(user.userNameInput);
            user.userNameInput=validation.checkName(user.userNameInput,'First Name')
        }catch(e){
            errors.push(e);
        }
        // try{
        //     user.lastNameInput=validation.checkName(user.lastNameInput,'Last Name')
        // }catch(e){
        //     errors.push(e);
        // }
        try{
            user.passwordInput=xss(user.passwordInput)
            user.passwordInput=validation.checkPassword(user.passwordInput);
        }catch(e){
            errors.push(e);
        }
        try{
            user.confirmPasswordInput=xss(user.confirmPasswordInput);
            if(!user.confirmPasswordInput){throw `Confirm password not provided`}
            if(user.confirmPasswordInput!==user.passwordInput){throw `Passwords don't match`}
        }catch(e){
            errors.push(e);
        }
        try{
            user.ageInput=xss(user.ageInput);
            user.ageInput=validation.checkAge(parseInt(user.ageInput))
        }catch(e){
            errors.push(e);
        }
        // try{
        //     user.roleInput=validation.checkRole(user.roleInput);
        //   }catch(e){
        //     errors.push(e);
        // }
        if (errors.length > 0) {
            return res.status(400).render('register',{Titlename:'Registration page',errors:errors,hasErrors:true})
          }
        try{
            const {userNameInput,ageInput,emailAddressInput,passwordInput,roleInput}=user
            //Role implementation pending
            const newUser=await userDataFunctions.createUser(userNameInput,ageInput,emailAddressInput,passwordInput);
            if(newUser){res.redirect('login')}
        }catch(e){
            errors.push(e);
            res.status(400).render('register',{Titlename:'Registration page',errors:errors,hasErrors:true})
            //res.status(500).json('Internal server error')
        }

    });

    router.route('/login')
    .get(async (req,res)=>{
        res.render('login',{Titlename: 'Login page'})
    })
    .post(async (req,res)=>{
        let user=req.body;
        let errors=[];
        try{
            //user.emailAddressInput=validation.checkEmail(user.emailAddressInput);
            user.emailAddressInput=xss(user.emailAddressInput)
            if(!user.emailAddressInput){throw `Email not provided`}
            if(!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(user.emailAddressInput.trim())){throw `Invalid email id`}
        }catch(e){
            errors.push(e);
        }
        try{
            user.passwordInput=xss(user.passwordInput)
            user.passwordInput=validation.checkPassword(user.passwordInput);
        }catch(e){
            errors.push(e);
        }
        if(errors.length>0){
            return res.status(400).render('login',{Titlename:'Login page',errors:errors,hasErrors:true,user:user})

        }
        try{
            const {emailAddressInput,passwordInput}=user;
            let userDetails= await authFunction.checkUser(emailAddressInput,passwordInput);
            req.session.user=userDetails;
            if(userDetails){res.redirect('gamelist')}

        }catch(e){
            errors.push(e);
            res.status(400).render('login',{Titlename:'Login page',errors:errors,hasErrors:true})
        }
    })
    
    router.route('/').get(async (req,res)=>{
        // if (req.session.user) {
        //     return res.redirect('/gameList');
        // }
        // else{
        //     return res.render('mainpage');
        // }
        try{
        let user=undefined;
        if(req.session.user){user=req.session.user}
        return res.render('mainpage',{Titlename:'Home Page',user:user,profileId: req.session?.user?.userId})
        }catch(e){
            res.render('error',{Titlename:'Error page',errorMessage:e,profileId: req.session?.user?.userId})
        }
    })

    router.route('/logout').get(async (req, res) => {
        req.session.destroy();
        res.render('logout',{title:'Logout'})
      });

export default router;