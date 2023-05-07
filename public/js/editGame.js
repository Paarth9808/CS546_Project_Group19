let editGameForm=document.getElementById('update-game-form')
let nameText=document.getElementById('name')
let dateText=document.getElementById('releaseDate')
let genreText=document.getElementById('genre')
let descriptionText=document.getElementById('description')
let systemRequirementsText=document.getElementById('systemRequirements')
let errorsEditGame=document.getElementById('client-side-error-editGame')
let errorDivEditGame=document.getElementById('error')

checkString=(strVal,strName)=>{
    if(!strVal){ throw `${strName} not provided`}
    if (typeof(strVal)!== 'string'){ throw `Error: ${strName} must be a string!`; }
    strVal = strVal.trim();
    if (strVal.length === 0){throw `Error: ${strName} cannot be an empty string or string with just spaces`;}
    if (!isNaN(strVal)){throw `Error: ${strVal} is not a valid value for ${strName} as it only contains digits`;}
    return strVal;
}

checkDate=(dateVal)=>{
    let currentDate=new Date();
    let finalYear=currentDate.getFullYear()
    dateVal=dateVal.trim();
    let dateElements=dateVal.split('/')
    if(dateElements.length!=3){throw `Error: Year should be in MM/DD/YYYY format`}
    let month=dateElements[0],day=dateElements[1],year=dateElements[2]
    if(month.length!=2||day.length!=2||year.length!=4){throw `Error: Year should be in MM/DD/YYYY format`}
    if(Number(month)<1||Number(month)>12){throw `Month should be between 1 and 12`}
    if(Number(day)<1||Number(day>31)){throw `Day should be between 1 and 31`}
    if(Number(year)<1900||Number(year)>finalYear){throw `Year should be between 1900 and ${finalYear}`}
    if((Number(month))===2&&Number(day)>28){throw `Invalid date: Days for Feb should be between 1 and 28`}
    if([1, 3, 5, 7, 8, 10, 12].includes(Number(month))&&(Number(day)>31)){
        throw `Error: Invalid date`
    }
    if([4, 6, 9, 11].includes(Number(month))&&Number(day)>30){
        throw `Error: Invalid date`
    }
    return dateVal;
}

if(editGameForm){
    editGameForm.addEventListener('submit',(event)=>{
        let name=nameText.value;
        let date=dateText.value;
        let genre=genreText.value;
        let description=descriptionText.value;
        let systemRequirements=systemRequirementsText.value;
        errorsEditGame.innerHTML=''
        errorDivEditGame.hidden=true

        try{
            name=checkString(name,'Name of the game');
        }catch(e){
            event.preventDefault()
            const errorItem=document.createElement('li')
            errorItem.innerHTML=e;
            errorsEditGame.appendChild(errorItem);
            errorDivEditGame.hidden=false
        }
        try{
            if(!date){throw `Date not provided`}
            date=checkDate(date)
        }catch(e){
            event.preventDefault()
            const errorItem=document.createElement('li')
            errorItem.innerHTML=e;
            errorsEditGame.appendChild(errorItem);
            errorDivEditGame.hidden=false
        }
        try{
            genre=checkString(genre,'Genre')
        }catch(e){
            event.preventDefault()
            const errorItem=document.createElement('li')
            errorItem.innerHTML=e;
            errorsEditGame.appendChild(errorItem);
            errorDivEditGame.hidden=false
        }
        try{
            description=checkString(description,'Description')
        }catch(e){
            event.preventDefault()
            const errorItem=document.createElement('li')
            errorItem.innerHTML=e;
            errorsEditGame.appendChild(errorItem);
            errorDivEditGame.hidden=false 
        }
        try{
            systemRequirements=checkString(systemRequirements,'System requirements')
        }catch(e){
            event.preventDefault()
            const errorItem=document.createElement('li')
            errorItem.innerHTML=e;
            errorsEditGame.appendChild(errorItem);
            errorDivEditGame.hidden=false
        }
    })
}
