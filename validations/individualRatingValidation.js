import { ObjectId } from "mongodb";
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
    checkReview(review){
        if(!review){throw 'Review not provided'}
        if (typeof(review)!== 'string'){ throw `Error: Review must be a string!`; }
        review = review.trim();
        if (review.length === 0){throw `Error: Review cannot be an empty string or string with just spaces`;}
        //if(!isNaN(review)){throw `Review cannot be just numbers`}
        if(!/[A-Za-z]/.test(review)){throw `Review should contain atleast one letter`}
        return review;
    },
    checkNumber(numVal,numName){
        if(!numVal){throw `${numName} not provided`}
        if(isNaN(numVal)){throw `Error: ${numName} should be a valid number`}
        if(typeof(numVal)!=='number'){throw `Error: ${numName} should be a number`}
        if(numVal<1||numVal>10){throw `Rating should be between 1 and 10`}
        return numVal
    }
}

export default exportedMethods;