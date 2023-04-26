import { Router } from "express";
const router = Router();
import { gameListData } from "../data/index.js";
import { gameData } from "../data/index.js";

router.route('/gameList').get(async (req,res)=>{

    try{
        const game = await gameData.getAll();
        return res.status(200).json(game)
        
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