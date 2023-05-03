import { games } from "../config/mongoCollection.js";
import { ObjectId } from "mongodb";

const validation = {

    vname (name) {

      if (name.trim() == '') throw 'name should be no empty spaces';
      if (typeof(name) != 'string') throw 'sortWay type wrong';

      return name;

    },

    vreleaseDate (releaseDate) {
      if (releaseDate.trim() == '') throw 'releaseDate should be no empty spaces';
      if (typeof(releaseDate) != 'string') throw 'sortWay type wrong';
      let currentDate = new Date();
      let finalYear = currentDate.getFullYear()
      releaseDate = releaseDate.trim();
      let dateElements = releaseDate.split('/')
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
      return releaseDate;
    },

    vage (age) {
      if (typeof(Number(age)) != 'number') throw 'age type wrong';
    },

    vgenre (genre) {
      if (genre.trim() == '') throw 'genre should be no empty spaces';
      if (typeof(genre) != 'string') throw 'genre type wrong';

    },

    vdescription (description) {
      if (description.trim() == '') throw 'description should be no empty spaces';
      if (typeof(description) != 'string') throw 'description type wrong';
    },

    vplatformInput (platform) {
      if (platform.trim() == '') throw 'platform should be no empty spaces';
      if (typeof(platform) != 'string') throw 'platform type wrong';
    }



  };

const getGameByGerne = async (genre) => {
    if (genre.trim() == '') throw 'platform should be no empty spaces';
    if (typeof(genre) != 'string') throw 'sortWay type wrong';

    const gameCollection = await games();
    let res = await gameCollection.find({ genre : genre }).toArray();
    for (let i = 0; i < res.length; i++) {
        res[i]._id = res[i]._id.toString();
    }
    return res;
}

const getGameByPlatform = async (platform) => {
    if (platform.trim() == '') throw 'platform should be no empty spaces';
    if (typeof(platform) != 'string') throw 'sortWay type wrong';
    if (platform != 'xbox' && platform != 'switch' && platform != 'ps5' && platform != 'pc') throw 'sortWay input wrong';

    const gameCollection = await games();
    let res = await gameCollection.find({ systemRequirements : platform }).toArray();
    for (let i = 0; i < res.length; i++) {
        res[i]._id = res[i]._id.toString();
    }
    return res;
}

const sortGameByRate = async (sortWay) => {
    if (sortWay.trim() == '') throw 'sortWay should be no empty spaces';
    if (typeof(sortWay) != 'string') throw 'sortWay type wrong';
    if (sortWay != 'ascending' && sortWay != 'descending') throw 'sortWay input wrong';
    let s = 0;
    if (sortWay == 'ascending') s = 1;
    if (sortWay == 'descending') s = -1;
    const gameCollection = await games();
    let res = await gameCollection.find({}).sort({ rating: s }).toArray();
    for (let i = 0; i < res.length; i++) {
        res[i]._id = res[i]._id.toString();
    }
    return res;
}

const sortGameByDate = async (sortWay) => {

    if (sortWay.trim() == '') throw 'sortWay should be no empty spaces';
    if (typeof(sortWay) != 'string') throw 'sortWay type wrong';
    if (sortWay != 'ascending' && sortWay != 'descending') throw 'sortWay input wrong';
    let s = 0;
    if (sortWay == 'ascending') s = 1;
    if (sortWay == 'descending') s = -1;

    const gameCollection = await games();
    let res = await gameCollection.find({}).sort({ releaseDate : s }).toArray();
    for (let i = 0; i < res.length; i++) {
        res[i]._id = res[i]._id.toString();
    }
    return res;
}

const getGameByName = async (name) => {
    if (name.trim() == '') throw 'no name exist';
    if (typeof(name) != 'string') throw 'name type wrong';
    const gameCollection = await games();
    let res = await gameCollection.find({ name : name }).toArray();
    if (res.length > 0) return 'exist';
    else return 'unexist';
}

const ageFilter = (age, games) => {
    if (!age) throw 'none age';
    if (!games) throw 'none games';
    if (typeof(age) != 'number') throw 'wrong age format';
    let filtered = [];
    for (let i = 0; i < games.length; i++) {
        if (age >= games[i].ageRating) filtered.add(games[i]);
    }
    return filtered;
}

const createGame= async (
    releaseDate,
    name,
    genre,
    description,
    systemRequirements,
    ageRating

)=>{

    try {
        let v1 = validation.vname(name);
        let v2 = validation.vreleaseDate(releaseDate);
        let v3 = validation.vage(ageRating);
        let v4 = validation.vgenre(genre);
        let v5 = validation.vdescription(description);
        let v6 = validation.vplatformInput(systemRequirements);
    } catch (e) {

        throw e;

    };

    let newGame={
        releaseDate: releaseDate,
        name: name,
        genre: genre,
        description: description,
        rating: 0, 
        individualRatings: [],
        systemRequirements: systemRequirements,
        ageRating: ageRating,
        commentIds: []
    }

    if (systemRequirements != 'ps5' && systemRequirements != 'xbox' && systemRequirements != 'pc' && systemRequirements != 'switch') throw 'platform wrong';
    
    if (ageRating != 18 && ageRating != 15 && ageRating != 12) throw 'ageRating format wrong';

    const gameCollection= await games();
    const insertInfo=await gameCollection.insertOne(newGame);
    if (!insertInfo.acknowledged || !insertInfo.insertedId) throw 'Could not add game';
    
    return ' game created';
}

//console.log(await createGame('01/01/2022', 'eee', 'action', 'aaa', 'xbox', 18));

export default {getGameByGerne, getGameByPlatform, sortGameByDate, sortGameByRate, getGameByName, ageFilter, createGame};