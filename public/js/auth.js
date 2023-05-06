let loginForm=document.getElementById('login-form');
let emailText=document.getElementById('emailAddressInput')
let passwordText=document.getElementById('passwordInput')
let errors=document.getElementById('client-side-error-login')
let errorDiv=document.getElementById('error')

let registrationForm=document.getElementById('registration-form')
let userNameText=document.getElementById('userNameInput')
let ageText=document.getElementById('ageInput')
let confirmPasswordText=document.getElementById('confirmPasswordInput')
let regErrorDiv=document.getElementById('error-registration')
let errorsReg=document.getElementById('client-side-error-reg')

checkName=(strVal,strName)=>{
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
}

checkAge=(age)=>{
    if(!age){throw "You must supply age";}
    if(typeof age !== 'number'){throw "Error: Age is not of type number";}
    if(age < 13 || age >125){
        throw "Does not meet the guidelines for age limit(User should be over 13)"
    }
    return age;
}

if(loginForm){
    //console.log('Login form clientside')
    loginForm.addEventListener('submit',(event)=>{
        let email=emailText.value;
        errors.innerHTML=''
        errorDiv.hidden=true
        try{
             //referred https://www.w3resource.com/javascript/form/email-validation.php
            if(!email){throw `Email not provided`}
            email=email.trim().toLowerCase();
            if(!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)){throw `Invalid email id`}
        }catch(e){
            event.preventDefault()
            const errorItem=document.createElement('li')
            errorItem.innerHTML=e;
            errors.appendChild(errorItem);
            errorDiv.hidden=false
        }

        try{
            if(!passwordText.value){throw `Password not provided`}
            if(typeof(passwordText.value)!=='string'){throw `Password must be a string`}
            // passwordText.value=passwordText.value.trim();
            if(passwordText.value.length==0){throw `Error: Password cannot be an empty string`}
            if(/[ ]/.test(passwordText.value)){
                throw `Password should not contain spaces`
            }
            if(passwordText.value.length<8){throw `Password should be atleast 8 letters long`}
            if(!/[A-Z]/.test(passwordText.value)){ throw `Password should contain atleast one uppercase character`}
            if(!/[0-9]/.test(passwordText.value)){ throw `Password should contain atleast one number`}
            if(!/[^A-Za-z0-9]/.test(passwordText.value)){throw `Password should contain atleast one special character`}
        }catch(e){
            event.preventDefault()
            const errorItem=document.createElement('li')
            errorItem.innerHTML=e;
            errors.appendChild(errorItem);
            errorDiv.hidden=false
        }

    })
}

if(registrationForm){
    registrationForm.addEventListener('submit',(event)=>{
        let userName=userNameText.value;
        let email=emailText.value;
        let age=parseInt(ageInput.value);
        let password=passwordText.value;
        let confirmPassword=confirmPasswordText.value;
        errorsReg.innerHTML='';
        regErrorDiv.hidden=true;

        try{
            userName=checkName(userName,'User Name');
        }catch(e){
            event.preventDefault()
            const errorItem=document.createElement('li')
            errorItem.innerHTML=e;
            errorsReg.appendChild(errorItem);
            regErrorDiv.hidden=false;
        }

        try{
            //referred https://www.w3resource.com/javascript/form/email-validation.php
            if(!email){throw `Email not provided`}
            email=email.trim().toLowerCase();
            if(!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)){throw `Invalid email id`}
        }catch(e){
            event.preventDefault()
            const errorItem=document.createElement('li')
            errorItem.innerHTML=e;
            errorsReg.appendChild(errorItem);
            regErrorDiv.hidden=false;
        }

        try{
            age=checkAge(age);
        }catch(e){
            event.preventDefault()
            const errorItem=document.createElement('li')
            errorItem.innerHTML=e;
            errorsReg.appendChild(errorItem);
            regErrorDiv.hidden=false;
        }

        try{
            if(!password){throw `Password not provided`}
            if(typeof(password)!=='string'){throw `Password must be a string`}
            // password=password.trim();
            if(password.length==0){throw `Error: Password cannot be an empty string`}
            if(/[ ]/.test(password)){
                throw `Password should not contain spaces`
            }
            if(password.length<8){throw `Password should be atleast 8 letters long`}
            //CONSTRAINTS PENDING FOR PASSWORD
            if(!/[A-Z]/.test(password)){ throw `Password should contain atleast one uppercase character`}
            if(!/[0-9]/.test(password)){ throw `Password should contain atleast one number`}
            if(!/[^A-Za-z0-9]/.test(password)){throw `Password should contain atleast one special character`}
        }catch(e){
            event.preventDefault()
            const errorItem=document.createElement('li')
            errorItem.innerHTML=e;
            errorsReg.appendChild(errorItem);
            regErrorDiv.hidden=false;
        }

        try{
            if(!confirmPassword){ throw `Confirm password not provided`}
            if(confirmPassword!==password){ throw `Passwords do not match`}
        }catch(e){
            event.preventDefault()
            const errorItem=document.createElement('li')
            errorItem.innerHTML=e;
            errorsReg.appendChild(errorItem);
            regErrorDiv.hidden=false;
        }

    })
}