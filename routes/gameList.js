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
});

router.route('/gameList/genre').get(async (req,res)=>{

    const genre = req.body.genre;

    try{
        const game = await gameListData.getGameByGerne(gerne);
        return res.status(200).json(game)
        
    }catch(e){
        return res.status(404).json({error:e})
    }
});

router.route('/gameList/Platform').get(async (req,res)=>{

    const platform = req.body.platform;

    try{
        const game = await gameListData.getGameByPlatform(platform);
        return res.status(200).json(game)
        
    }catch(e){
        return res.status(404).json({error:e})
    }
});

router.route('/gameList/sortByRate').get(async (req,res)=>{


    try{
        const game = await gameListData.sortGameByRate();
        return res.status(200).json(game)
        
    }catch(e){
        return res.status(404).json({error:e})
    }
});

router.route('/gameList/sortByDate').get(async (req,res)=>{


    try{
        const game = await gameListData.sortGameByDate();
        return res.status(200).json(game)
        
    }catch(e){
        return res.status(404).json({error:e})
    }
});

export default router;