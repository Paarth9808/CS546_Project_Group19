import { games } from "../config/mongoCollection.js";
import { ObjectId } from "mongodb";
import validation from '../validations/gameValidation.js';

const createGame= async (
    releaseDate,
    name,
    genre,
    description,
    systemRequirements,
    ageRating
    //photo                         //Not sure..
)=>{
    //Validation pending
    let newGame={
        // photo: photo,
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
    releaseDate=validation.checkDate(releaseDate)
    name=validation.checkString(name,'Name')
    genre=validation.checkStringArray(genre,'Genre')
    description=validation.checkString(description,'Description')
    if (systemRequirements != 'ps5' || systemRequirements != 'xbox' || systemRequirements != 'pc' || systemRequirements != 'switch') throw 'platform wrong';
    
    if (ageRating != 18 && ageRating != 15 && ageRating != 12) throw 'ageRating format wrong';
    const gameCollection= await games();
    const insertInfo=await gameCollection.insertOne(newGame);
    if (!insertInfo.acknowledged || !insertInfo.insertedId)
      throw 'Could not add game';
    const newId= insertInfo.insertedId.toString();
    const game= await getGame(newId);
    return game;
}

const getGame = async (id) => {
    //id=validation.checkId(id);
    const gameCollection=await games();
    const game= await gameCollection.findOne({_id: new ObjectId(id)})
    if(game === null){ throw `Game with id: ${id} not found` }
    game._id=game._id.toString();
    return game;
  };

const getAll = async () => {
    const gameCollection=await games();
    let allGames=await gameCollection.find({}).toArray();
    allGames=allGames.map((element)=>{element._id=element._id.toString();
    return element
    })
    return allGames
};

const updateGame=async(
  id,
  gameInfo
)=>{
    id=validation.checkId(id);
    if(gameInfo.releaseDate){gameInfo.releaseDate=validation.checkDate(gameInfo.releaseDate)}
    if(gameInfo.name){gameInfo.name=validation.checkString(gameInfo.name,'Name')}
    if(gameInfo.genre){gameInfo.genre=validation.checkStringArray(gameInfo.genre,'Genre')}
    if(gameInfo.description){gameInfo.description=validation.checkString(gameInfo.description,'Description')}
    if(gameInfo.systemRequirements){gameInfo.systemRequirements=validation.checkStringArray(gameInfo.systemRequirements,'System Requirements')}
    if(gameInfo.ageRating){
      gameInfo.ageRating=validation.checkString(gameInfo.ageRating,'Age rating')
      gameInfo.ageRating=validation.checkAgeRating(gameInfo.ageRating,'Age rating')
    }
    // const updateGame={
    //   releaseDate:releaseDate,
    //   name:name,
    //   genre:genre,
    //   description:description,
    //   systemRequirements:systemRequirements,
    //   ageRating:ageRating,
    // }
    const gameCollection=await games();
    let currentGame=await getGame(id);
    if(currentGame.name===gameInfo.name&&validation.checkArraysEqual(currentGame.genre,gameInfo.genre)&&currentGame.description===gameInfo.description&&validation.checkArraysEqual(currentGame.systemRequirements,gameInfo.systemRequirements)&&currentGame.ageRating===gameInfo.ageRating){
      throw `New game and current game are the same`
    }
    if(currentGame===null){throw `Game with id: ${id} not found`}
    const updatedInfo= await gameCollection.findOneAndUpdate(
      {_id: new ObjectId(id)},
      {$set: gameInfo},
      {returnDocument: 'after'}
    );
    if (updatedInfo.lastErrorObject.n === 0) {
      throw 'Could not update game successfully';
    }
    updatedInfo.value._id=updatedInfo.value._id.toString();
    return updatedInfo.value;
}

const removeGame=async(id)=>{
  id=validation.checkId(id);
  const gameCollection=await games();
  let game = await gameCollection.findOne({_id:new ObjectId(id)})
  if(game==null){throw `Game with id ${id} not found`}
  const deletionInfo= await gameCollection.findOneAndDelete({_id: new ObjectId(id)})
  if(deletionInfo.lastErrorObject.n===0){
    throw `Could not delete game with id of ${id}`
  }
  return `${deletionInfo.value.name} has been successfully deleted!`

}

export default {createGame,getGame,getAll,updateGame,removeGame}