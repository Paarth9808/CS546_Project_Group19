
import { user } from "../config/mongoCollection.js";
import bcrypt from 'bcryptjs';


const checkUser = async (emailAddress, password) => {
    if(!emailAddress||!password){
      throw `Both email and password should be provided`
    }
    if(typeof(emailAddress)!=='string'){throw `Email address should be a string`}
    emailAddress=emailAddress.trim().toLowerCase();
    //referred https://www.w3resource.com/javascript/form/email-validation.php
    if(!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(emailAddress)){throw `Incorrect email format`}

    if(typeof(password)!=='string'){throw `Password must be a string`}
    password=password.trim();
    if(password.length==0){throw `Error: Password cannot be an empty string`}
    if(/[ ]/.test(password)){
      throw `Password should not contain spaces`
    }
    if(password.length<8){throw `Password should be atleast 8 letters long`}
    
    let userCollection = await user();
    let currentUser = await userCollection.findOne({email: emailAddress})
    if(currentUser===null){throw `Either the email address or password is invalid`}
    let match= await bcrypt.compare(password,currentUser.hashedPassword);
    if(match){
      return {userId:currentUser._id.toString(),userName:currentUser.userName,emailAddress:currentUser.email}//,role:user.role}
    }else{ throw `Either the email address or password is invalid`}
  };

  export default {checkUser};