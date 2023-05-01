import { games } from "../config/mongoCollection.js";
import { ObjectId } from "mongodb";

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
    if (platform != 'xbox' || platform != 'switch' || platform != 'ps5' || platform != 'pc') throw 'sortWay input wrong';

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
    if (sortWay != 'ascending' || sortWay != 'descending') throw 'sortWay input wrong';
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
    if (sortWay != 'ascending' || sortWay != 'descending') throw 'sortWay input wrong';
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


export default {getGameByGerne, getGameByPlatform, sortGameByDate, sortGameByRate, getGameByName, ageFilter};