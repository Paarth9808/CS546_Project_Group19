import { games } from "../config/mongoCollection.js";
import { ObjectId } from "mongodb";

const getGameByGerne = async (grene) => {
    const gameCollection = await games();
    let res = gameCollection.find({ genre : grene }).toArray();
    for (let i = 0; i < res.length; i++) {
        res[i]._id = res[i]._id.toString();
    }
    return res;
}

const getGameByPlatform = async (platform) => {
    const gameCollection = await games();
    let res = gameCollection.find({ systemRequirements : platform }).toArray();
    for (let i = 0; i < res.length; i++) {
        res[i]._id = res[i]._id.toString();
    }
    return res;
}

const sortGameByRate = async () => {
    const gameCollection = await games();
    let res = gameCollection.find({}).sort({ rating: -1 }).toArray();
    for (let i = 0; i < res.length; i++) {
        res[i]._id = res[i]._id.toString();
    }
    return res;
}

const sortGameByDate = async () => {
    const gameCollection = await games();
    let res = gameCollection.find({}).sort({ releaseDate : -1 }).toArray();
    for (let i = 0; i < res.length; i++) {
        res[i]._id = res[i]._id.toString();
    }
    return res;
}