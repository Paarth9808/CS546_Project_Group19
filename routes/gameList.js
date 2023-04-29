import { Router } from "express";
const router = Router();
import { gameListData } from "../data/index.js";
import { gameData } from "../data/index.js";

router.route('/createGame').get(async (req, res)=>{
  res.render('createGame', {title : 'createGame'});

})
.post(async (req, res) =>{
  const genre = req.body.genreInput;
  const platform = req.body.platformInput;
  const name = req.body.gameNameInput;
  const releaseDate = req.body.releaseDateInput;
  const age = req.body.ageInput;
  const description = req.body.descriptionInput;

  try {
    if (genre) {
      if (genre.trim() == '') throw 'genre should be no empty spaces';
      if (typeof(genre) != 'string') throw 'sortWay type wrong';
    }
    if (platform) {
      if (platform.trim() == '') throw 'platform should be no empty spaces';
      if (typeof(platform) != 'string') throw 'sortWay type wrong';
  }
    if (name) {
      if (name.trim() == '') throw 'name should be no empty spaces';
      if (typeof(name) != 'string') throw 'sortWay type wrong';
    }
    if (releaseDate) {
      if (releaseDate.trim() == '') throw 'releaseDate should be no empty spaces';
      if (typeof(releaseDate) != 'string') throw 'sortWay type wrong';
    }
    if (age) {
      if (age.trim() == '') throw 'age should be no empty spaces';
      if (typeof(age) != 'string') throw 'sortWay type wrong';
    }
    if (description) {
      if (description.trim() == '') throw 'description should be no empty spaces';
      if (typeof(age) != 'string') throw 'sortWay type wrong';
    }

    const newGame = await gameData.createGame(    
      releaseDate,
      name,
      genre,
      description,
      platform,
      age);
    if (newGame) res.redirect('gameList');
    if (!newGame) throw 'not created';


  } catch (e) {
    res.status(400).render('createGame', {title: "createGame", showErrorMessage : e});
  }

});

router.route('/gameList').get(async (req,res)=>{

    try{
        const game = await gameData.getAll();
        res.render('gameList', {title: "gameList", sortTerm: game});
        
    }catch(e){
        return res.status(404).json({error:e})
    }
})
.post(async (req, res) => {
    //code here for POST

    const genre = req.body.genreInput;
    const platform = req.body.platformInput;
    const sortWay = req.body.sortWayInput;
    const sortBy = req.body.sortByInput;

    if (!genre && !platform && !sortWay && !sortBy) res.status(400).render('gameList', {title: "gameList", showErrorMessage : 'Sort/Filter missing'});



    try {
        if (genre) {
            if (genre.trim() == '') throw 'platform should be no empty spaces';
            if (typeof(genre) != 'string') throw 'sortWay type wrong';
        }
        if (platform) {
            if (platform.trim() == '') throw 'platform should be no empty spaces';
            if (typeof(platform) != 'string') throw 'sortWay type wrong';
            if (platform != 'xbox' || platform != 'switch' || platform != 'ps5' || platform != 'pc') throw 'sortWay input wrong';
        }
        if (sortWay && sortBy) {
            if (sortWay.trim() == '') throw 'sortWay should be no empty spaces';
            if (typeof(sortWay) != 'string') throw 'sortWay type wrong';
            if (sortWay != 'ascending' || sortWay != 'descending') throw 'sortWay input wrong';
            if (sortWay.trim() == '') throw 'sortWay should be no empty spaces';
            if (typeof(sortWay) != 'string') throw 'sortWay type wrong';
            if (sortWay != 'ascending' || sortWay != 'descending') throw 'sortWay input wrong';
        }


    } catch (e) {
      res.status(400).render('gameList', {title: "gameList", showErrorMessage : e});
    }





    try {
        if (genre) {
            let ans = await gameListData.getGameByGerne(genre);
            
            res.render('gameList', {title: "gameList", sortTerm: ans});
        

      } else if (platform) {

        let ans = await gameListData.getGameByPlatform(platform);
            
        res.render('gameList', {title: "gameList", sortTerm: ans});

      } else if (sortWay && sortBy) {
        if (sortBy == 'date') {
            let ans = await gameListData.sortGameByDate(sortWay);
            
            res.render('gameList', {title: "gameList", sortTerm: ans});

        } else if (sortBy == 'rate') {
            let ans = await gameListData.sortGameByRate(sortWay);
            
            res.render('gameList', {title: "gameList", sortTerm: ans});
        }

      } else {
        res.status(500).render('error', {title : "error", message: "Internal Server Error" });
      }

    } catch (e) {
      res.render('gameList', {title: "gameList", showErrorMessage : e});
    }

  });


export default router;