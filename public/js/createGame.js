(function() {

    const validation = {

      vname (name) {

        if (name.trim() == '') throw 'name should be no empty spaces';
        if (typeof(name) != 'string') throw 'sortWay type wrong';

        return name;

      },

      vreleaseDate (releaseDate) {
        if (releaseDate.trim() == '') throw 'releaseDate should be no empty spaces';
        if (typeof(releaseDate) != 'string') throw 'sortWay type wrong';
        let currentDate=new Date();
        let finalYear=currentDate.getFullYear()
        currentDate=currentDate.trim();
        let dateElements=currentDate.split('/')
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
        return currentDate;
      },

      vage (age) {
        if (age.trim() == '') throw 'age should be no empty spaces';
        if (typeof(age) != 'number') throw 'sortWay type wrong';
      },

      vgenre (genre) {
        if (genre.trim() == '') throw 'genre should be no empty spaces';
        if (typeof(genre) != 'string') throw 'sortWay type wrong';

      },

      vdescription (description) {
        if (description.trim() == '') throw 'description should be no empty spaces';
        if (typeof(description) != 'string') throw 'sortWay type wrong';
      },

      vplatformInput (platform) {
        if (platform.trim() == '') throw 'platform should be no empty spaces';
        if (typeof(platform) != 'string') throw 'sortWay type wrong';
      }


  
    };
  


    const createform = document.getElementById('createGame-form');

    if (createform) {

      const errorTextElement = document.getElementById('errorText');
      const gameNameInput = document.getElementById('gameNameInput');
      const releaseDateInput = document.getElementById('releaseDateInput');
      const ageInput = document.getElementById('ageInput');
      const genreInput = document.getElementById('genreInput');
      const descriptionInput = document.getElementById('descriptionInput');
      const platformInput = document.getElementById('platformInput');



      createform.addEventListener('submit', (event) => {
        
        try {
  
          const text1 = gameNameInput.value;
          const text2 = releaseDateInput.value;
          const text3 = ageInput.value;
          const text4 = genreInput.value;
          const text5 = descriptionInput.value;
          const text6 = platformInput.value;

          let v1 = validation.vname(text1);
          let v2 = validation.vreleaseDate(text2);
          let v3 = validation.vage(text3);
          let v4 = validation.vgenre(text4);
          let v5 = validation.vdescription(text5);
          let v6 = validation.vplatformInput(text6);

          errorTextElement.innerHTML = '';
          errorTextElement.hidden = true;
  
  
          

        } catch (e) {
          
          const message = typeof e === 'string' ? e : e.message;
          errorTextElement.innerHTML = e;
          errorTextElement.hidden = false;
  
          event.preventDefault();
          
        }
        
  
      });



    }

  
  
  
  
  })();
  