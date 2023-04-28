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
        if(!isNaN(review)){throw `Review cannot be just numbers`}
        return review.trim();
    },
    checkNumber(numVal,numName){
        if(!numVal){throw `${numName} not provided`}
        if(isNaN(numVal)){throw `Error: ${numName} should be a valid number`}
        if(typeof(numVal)!=='number'){throw `Error: ${numName} should be a number`}
        return numVal
    }
}

export default exportedMethods;