let addReviewForm=document.getElementById('add-review-form')
let reviewText=document.getElementById('review')
let ratingText=document.getElementById('rating')
let addRatingErrorDiv=document.getElementById('addRatingError')
let errorsAddRating=document.getElementById('client-side-error-add-review')

let editReviewForm=document.getElementById('edit-review-form');
let editRatingErrorDiv=document.getElementById('editRatingError')
let errorsEditRating=document.getElementById('client-side-error-edit-review')

checkReview=(review)=>{
    if(!review){throw 'Review not provided'}
    if(typeof(review)!== 'string'){ throw `Error: Review must be a string!`; }
    review = review.trim();
    if(review.length === 0){throw `Error: Review cannot be an empty string or string with just spaces`;}
    return review;
}
checkNumber=(numVal,numName)=>{
    if(!numVal){throw `${numName} not provided`}
    if(isNaN(numVal)){throw `Error: ${numName} should be a valid number`}
    if(typeof(numVal)!=='number'){throw `Error: ${numName} should be a number`}
    if(numVal<1||numVal>10){throw `Rating should be between 1 and 10`}
    return numVal
}

if(addReviewForm){
    addReviewForm.addEventListener('submit',(event)=>{
        let review=reviewText.value;
        errorsAddRating.innerHTML=''
        addRatingErrorDiv.hidden=true
        let rating=parseInt(ratingText.value);
        try{
            review=checkReview(review);
        }catch(e){
            event.preventDefault();
            const errorItem=document.createElement('li')
            errorItem.innerHTML=e;
            errorsAddRating.appendChild(errorItem)
            addRatingErrorDiv.hidden=false;
        }

        try{
            rating=checkNumber(rating,'Rating');
        }catch(e){
            event.preventDefault();
            const errorItem=document.createElement('li')
            errorItem.innerHTML=e;
            errorsAddRating.appendChild(errorItem)
            addRatingErrorDiv.hidden=false;
        }

    })
}

if(editReviewForm){
    editReviewForm.addEventListener('submit',(event)=>{
        let review=reviewText.value;
        let rating=parseInt(ratingText.value);
        errorsEditRating.innerHTML=''
        editRatingErrorDiv.hidden=true
        try{
            review=checkReview(review);
        }catch(e){
            event.preventDefault();
            const errorItem=document.createElement('li')
            errorItem.innerHTML=e;
            errorsEditRating.appendChild(errorItem)
            editRatingErrorDiv.hidden=false
        }
        try{
            rating=checkNumber(rating,'Rating');
        }catch(e){
            event.preventDefault();
            const errorItem=document.createElement('li')
            errorItem.innerHTML=e;
            errorsEditRating.appendChild(errorItem)
            editRatingErrorDiv.hidden=false
        }
    })
}