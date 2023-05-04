import { ObjectId } from "mongodb";
let isValidArray=(array)=>{
    for(let i=0;i<array.length;i++){
        if(!array[i])
            return false;
    }
    return true;
}

let trimStringArray=(array)=>{
    for(let i in array){
        array[i]=array[i].trim()
    }
    return array
}

const exportedMethods={
    
    checkId(id){
        if (!id) throw 'Id not provided';
        if (typeof id !== 'string') throw 'Error: id must be a string';
        id = id.trim();
        //if(!id) throw 'All fields need to have valid values';
        if (id.length === 0)
          throw 'Error: id cannot be an empty string or just spaces';
        if (!ObjectId.isValid(id)) throw 'Error: invalid object ID';
        return id;
        },
    checkString(strVal,strName){
        if(!strVal){ throw `${strName} not provided`}
        if (typeof(strVal)!== 'string'){ throw `Error: ${strName} must be a string!`; }
        strVal = strVal.trim();
        if (strVal.length === 0){throw `Error: ${strName} cannot be an empty string or string with just spaces`;}
        if (!isNaN(strVal)){throw `Error: ${strVal} is not a valid value for ${strName} as it only contains digits`;}
        return strVal;
    },
    checkStringArray(arrayVal,arrayName){
        if(!arrayVal){ throw `${arrayName} not provided`}
        //if(!arrayVal.trim()){ throw `All fields need to have valid values`}
        if(typeof(arrayVal)==='string')
            if(!arrayVal.trim()){throw `All fields need to have valid values`}
        if(!Array.isArray(arrayVal)){ throw `Error: ${arrayName} should be an array`}
        if(arrayVal.length===0){throw `Error: ${arrayName} should not be empty`}
        if(!isValidArray(arrayVal)){throw `Error: Each value in ${arrayName} should be valid`}
        if(!arrayVal.every((element)=>{if(typeof(element)=='string'){return true}})){throw `Every element in ${arrayName} should be a string`}
        //if(!arrayVal.every((element)=>{if(element)){return true}})){throw `Every element in the array should be a valid string`}
        arrayVal=trimStringArray(arrayVal);
        if(!arrayVal.every((element)=>{if(element.length>0){return true}})){throw `Every element in ${arrayName} should be a valid string`}
        return arrayVal
    },
    checkNumber(numVal,numName){
        if(!numVal){throw `${numName} not provided`}
        if(isNaN(numVal)){throw `Error: ${numName} should be a valid number`}
        if(typeof(numVal)!=='number'){throw `Error: ${numName} should be a number`}
        return numVal
    },
    checkAgeRating(rating,ratingName){
        if(!rating){throw `${ratingName} not provided`}
        if(rating<13){throw `${ratingName} should be 13 or above`}
        if(rating>125){throw `${ratingName} should be 125 or below`}
        return rating;
    },
    checkDate(dateVal){
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
    },
    checkArraysEqual(arr1,arr2){
        //console.log("Length arr1: "+arr1.length+"Length arr2: "+arr2.length)
        if(arr1.length!==arr2.length){
            return false
        }
        return JSON.stringify(arr1) === JSON.stringify(arr2);
    }
}

export default exportedMethods;