import { Router } from "express";
const router = Router();
import { gameListData } from "../data/index.js";
import { gameData } from "../data/index.js";


router.route('/creategame').get(async (req, res)=>{
  try{
    const userRole =req.session.user.role;
    if (userRole != 'admin') throw 'cannot access';
  }
  catch(e)
  {
    res.render('error', {errorMessage : 'you are not admin'});
    return;
  }
  res.render('createGame', {title : 'createGame'});

})
.post(async (req, res) =>{
  const genre = req.body.genreInput;
  const platform = req.body.platformInput;
  const name = req.body.gameNameInput;
  const releaseDate = req.body.releaseDateInput;
  const age = Number(req.body.ageInput);
  const description = req.body.descriptionInput;

  try {
    if (genre) {
      if (genre.trim() == '') throw 'genre should be no empty spaces';
      if (typeof(genre) != 'string') throw 'genre type wrong';
    }
    if (platform) {
      if (platform.trim() == '') throw 'platform should be no empty spaces';
      if (typeof(platform) != 'string') throw 'platform type wrong';
  }
    if (name) {
      if (name.trim() == '') throw 'name should be no empty spaces';
      if (typeof(name) != 'string') throw 'name type wrong';
    }
    if (releaseDate) {
      if (releaseDate.trim() == '') throw 'releaseDate should be no empty spaces';
      if (typeof(releaseDate) != 'string') 'releaseDate type wrong';
    }
    if (age) {
      if (typeof(age) != 'number') throw 'age type wrong';
    }
    if (description) {
      if (description.trim() == '') throw 'description should be no empty spaces';
      if (typeof(description) != 'string') throw 'description type wrong';
    }

    let testName = await gameListData.getGameByName(name);
    if (testName == 'exist') throw 'name exist';

    const newGame = await gameListData.createGame(releaseDate, name, genre, description, platform, age);
    if (newGame) res.render('createGame', {title: "createGame", showErrorMessage : 'Game Added!'});
    if (!newGame) throw 'not created';


  } catch (e) {
    res.render('createGame', {title: "createGame", showErrorMessage : e});

  }

});

router.route('/').get(async (req,res)=>{

  // const user = req.session.user;
  // let userAge = user.age;

  try{
    const Age = req.session.user.age;
  }
  catch(e)
  {
    res.redirect('/login');
    return;
  }

  const userAge = req.session.user.age;

    try{
        const game = await gameData.getAll();
        let filteredGame = gameListData.ageFilter(userAge, game);
        res.render('gameList', {title: "gameList", sortTerm: filteredGame});
        
    }catch(e){
        return res.status(404).json({error:e})
    }
})
.post(async (req, res) => {
    //code here for POST

    try{
      const Age = req.session.user.age;
    }
    catch(e)
    {
      res.redirect('/login');
      return;
    }

    const userAge = req.session.user.age;

    const genre = req.body.genreInput;
    const platform = req.body.platformInput;
    const sortWay = req.body.sortWayInput;
    const sortBy = req.body.sortByInput;

    if (!genre && !platform && !sortWay && !sortBy) res.status(400).render('gameList', {title: "gameList", showErrorMessage : 'Sort/Filter missing'});



    try {
        if (genre) {
            if (genre.trim() == '') throw 'genre should be no empty spaces';
            if (typeof(genre) != 'string') throw 'genre type wrong';
        }
        if (platform) {
            if (platform.trim() == '') throw 'platform should be no empty spaces';
            if (typeof(platform) != 'string') throw 'platform type wrong';
            if (platform != 'xbox' && platform != 'switch' && platform != 'ps5' && platform != 'pc') throw 'platform input wrong';
        }
        if (sortWay && sortBy) {
            if (sortWay.trim() == '') throw 'sortWay should be no empty spaces';
            if (typeof(sortWay) != 'string') throw 'sortWay type wrong';
            if (sortWay != 'ascending' && sortWay != 'descending') throw 'sortWay input wrong';
            if (sortWay.trim() == '') throw 'sortWay should be no empty spaces';
            if (typeof(sortWay) != 'string') throw 'sortWay type wrong';
            if (sortWay != 'ascending' && sortWay != 'descending') throw 'sortWay input wrong';
        }


    } catch (e) {
      return res.status(400).render('gameList', {title: "gameList", showErrorMessage : e});
    }





    try {
        if (genre) {
            let ans = await gameListData.getGameByGerne(genre);
           let filteredGame = gameListData.ageFilter(userAge, ans);
            
            res.render('gameList', {title: "gameList", sortTerm: filteredGame});
        

      } else if (platform) {

        let ans = await gameListData.getGameByPlatform(platform);
        let filteredGame = gameListData.ageFilter(userAge, ans);
            
        res.render('gameList', {title: "gameList", sortTerm: filteredGame});

      } else if (sortWay && sortBy) {
        if (sortBy == 'date') {
            let ans = await gameListData.sortGameByDate(sortWay);
            let filteredGame = gameListData.ageFilter(userAge, ans);
            
            res.render('gameList', {title: "gameList", sortTerm: filteredGame});

        } else if (sortBy == 'rate') {
            let ans = await gameListData.sortGameByRate(sortWay);
           let filteredGame = gameListData.ageFilter(userAge, ans);
            
            res.render('gameList', {title: "gameList", sortTerm: filteredGame});
        }

      } else {
        res.status(500).render('gameList', {title : "error", message: "Internal Server Error" });
      }

    } catch (e) {
      return res.render('gameList', {title: "gameList", showErrorMessage : e});
    }

  });


export default router;