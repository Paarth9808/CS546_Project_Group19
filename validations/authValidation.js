const exportedMethods={
 
    checkName(strVal,strName){
        if(!strVal){ throw `${strName} not provided`}
        if (typeof(strVal)!== 'string'){ throw `Error: ${strName} must be a string!`; }
        strVal = strVal.trim();
        if (strVal.length === 0){throw `Error: ${strName} cannot be an empty string or string with just spaces`;}
        // if(/[0-9]/.test(strVal)){
        //     throw `${strName} should not contain numbers `
        // }
        if(strVal.length<2||strVal.length>25){throw `${strName} should be between 2 to 25 characters`}
        if (!isNaN(strVal)){throw `Error: ${strVal} is not a valid value for ${strName} as it only contains digits`;}
        return strVal;
    },

    checkEmail(emailAddress){
        if(!emailAddress){throw `Email address not provided`}
        if(typeof(emailAddress)!=='string'){throw `Email address should be a string`}
        emailAddress=emailAddress.trim().toLowerCase();
        if(!emailValidator.validate(emailAddress)){throw `Incorrect email format`}
        return emailAddress
    },
    checkPassword(password){
        if(!password){throw `Password not provided`}
        if(typeof(password)!=='string'){throw `Password must be a string`}
        if(password.length==0){throw `Error: Password cannot be an empty string`}
        if(/[ ]/.test(password)){
            throw `Password should not contain spaces`
        }
        if(password.length<8){throw `Password should be atleast 8 letters long`}
        if(!/[A-Z]/.test(password)){ throw `Password should contain atleast one uppercase character`}
        if(!/[0-9]/.test(password)){ throw `Password should contain atleast one number`}
        if(!/[^A-Za-z0-9]/.test(password)){throw `Password should contain atleast one special character`}
        return password
    },
    
    checkAge(age){
        if(!age){throw "You must supply age";}
        if(typeof age !== 'number'){throw "Error: Age is not of type number";}
        if(age < 13 || age >130){
            throw "Does not meet the guidelines for age limit"
        }
        return age;
   }
}

export default exportedMethods;