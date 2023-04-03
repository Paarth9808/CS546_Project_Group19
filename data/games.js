import { games } from "../config/mongoCollection.js";
import { ObjectId } from "mongodb"

const createGame= async (
    releaseDate,
    name,
    genre,
    description,
    systemRequirements,
    ageRating
    //photo                         //Not sure
)=>{
    //Validation pending
    let newGame={
        // photo: photo,
        releaseDate: releaseDate,
        name: name,
        genre: genre,
        description: description,
        rating: 0, 
        systemRequirements: systemRequirements,
        like: 0,
        dislike: 0,
        ageRating: ageRating,
        commentIds: []
    }
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

export default {createGame,getGame}