//import { user } from "../config/mongoCollection";
import {ObjectId} from 'mongodb';

const exportedMethods = {
    checkId(id) {
        if (!id) throw 'Error: You must provide an id to search for';
        if (typeof id !== 'string') throw 'Error: id must be a string';
        id = id.trim();
        if (id.length === 0)
          throw 'Error: id cannot be an empty string or just spaces';
        if (!ObjectId.isValid(id)) throw 'Error: invalid object ID';
        return id;
    },

    checkString(strVal, varName) {
        if (!strVal) throw `Error: You must supply a ${varName}!`;
        if (typeof strVal !== 'string') throw `Error: ${varName} must be a string!`;
        strVal = strVal.trim();
        if (strVal.length === 0)
          throw `Error: ${varName} cannot be an empty string or string with just spaces`;
        if (!isNaN(strVal))
          throw `Error: ${strVal} is not a valid value for ${varName} as it only contains digits`;
        return strVal;
    },
    // ask if email should be stored in lowercase
    checkMail(email) {
      if(!email) throw 'email not supplied';
      email = email.trim();
      if(typeof email !== 'string') throw 'email should be of type String';
      var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;;
      if(!re.test(email)) throw 'Invalid Email';
      return email;
   },

   checkAge(age){
      if(!age){throw "You must supply age";}
      if(typeof age !== 'number'){throw "Error: Age is not of type number";}
      if(age < 13){
        throw "Does not agree the guidelines for age limit"
      }
      return age;
   },

   checkPass(password) {
      if(!password) throw 'Password not supplied';
      password = password.trim();
      if(typeof password !== 'string') throw 'password should be of type string';
      let bool = /[A-Z]/       .test(password) &&
                /[a-z]/       .test(password) &&
                /[0-9]/       .test(password) &&
                /[^A-Za-z0-9]/.test(password) &&
                password.length > 7
      if(!bool) throw 'Passowrd does not match the required conditions';
      return password;
  },
  // if role not specified 
   checkRole(role) {
    if(!role){
      role = 'user';
      return role;
    }else{
      role = role.toLowerCase();
      if(role !== 'admin' && role !== 'user') throw 'role should be admin or user only';
      return role;
    }
  }
};

export default exportedMethods;