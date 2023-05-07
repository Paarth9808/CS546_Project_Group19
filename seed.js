import {closeConnection,dbConnection} from './config/mongoConnection.js'
import {gameData,userData} from './data/index.js'
import { gameListData } from "../data/index.js";
import {createComment,getpartComment,deleteComment,updateComment,getCommentById,likeComment,dislikeComment,reportComment} from './data/comment.js'
import ratingData from './data/individualRatings.js'




async function main(){
    const db = await dbConnection();
    try{ 
        await gameListData.createGame('01/01/2020', 'game1', 'action', 'description', 'systemRequirements', 18, 'ps5');
        await gameListData.createGame('02/01/2020', 'game2', 'action', 'description', 'systemRequirements', 15, 'pc');
        await gameListData.createGame('03/01/2020', 'game3', 'shoot', 'description', 'systemRequirements', 18, 'xbox');
        await gameListData.createGame('05/01/2020', 'game4', 'shoot', 'description', 'systemRequirements', 13, 'ps5');
        await gameListData.createGame('01/01/2021', 'game5', 'shoot', 'description', 'systemRequirements', 18, 'ps5');
        await gameListData.createGame('01/02/2021', 'game6', 'ride', 'description', 'systemRequirements', 18, 'ps5');
        await gameListData.createGame('01/04/2022', 'game7', 'ride', 'description', 'systemRequirements', 13, 'xbox');
        await gameListData.createGame('01/01/2022', 'game8', 'action', 'description', 'systemRequirements', 13, 'ps5');
        await gameListData.createGame('01/01/2019', 'game9', 'action', 'description', 'systemRequirements', 13, 'ps5');
        await gameListData.createGame('01/01/2019', 'game10', 'action', 'description', 'systemRequirements', 15, 'pc');
        await gameListData.createGame('01/01/2018', 'game11', 'action', 'description', 'systemRequirements', 15, 'xbox');
        await gameListData.createGame('01/01/2017', 'game12', 'action', 'description', 'systemRequirements', 15, 'xbox');
        await gameListData.createGame('01/01/2016', 'game13', 'action', 'description', 'systemRequirements', 13, 'switch');
        await gameListData.createGame('01/01/2015', 'game14', 'action', 'description', 'systemRequirements', 13, 'switch');
        await gameListData.createGame('01/01/2015', 'game15', 'action', 'description', 'systemRequirements', 13, 'switch');


        await userData.createUser("Admin", 27, "test0@gmail.com", "Password@1", "admin");
        await userData.createUser("Caraxes", 27, "test1@gmail.com", "Password@1");
        await userData.createUser("Scarlett", 13, "test2@gmail.com", "Password@1");
        await userData.createUser("Korra", 17, "test3@gmail.com", "Password@1");
        await userData.createUser("Baba", 18, "test4@gmail.com", "Password@1");
        await userData.createUser("Nnita", 24, "test5@gmail.com", "Password@1");
        await userData.createUser("Babel", 23, "test6@gmail.com", "Password@1");
        await userData.createUser("Basilisk", 42, "test7@gmail.com", "Password@1");
        await userData.createUser("Ramu Kaka", 51, "test8@gmail.com", "Password@1");
        await userData.createUser("T4rik", 66, "test9@gmail.com", "Password@1");
        await userData.createUser("K1ng", 29, "test10@gmail.com", "Password@1");
        
        // await gameData.createGame('02/02/1970','COD4',['Shooter'],'Sample description',['Requirements'],'Teen');
        //console.log(await ratingData.addRating('644a21d77da3cea481dea2e6','63fed8db5fcdd3d13159a0f5','Best game ever',5))
        //console.log(await ratingData.update('644a21d77da3cea481dea2e6','63fed8db5fcdd3d13159a0f5','Worst game ever',1))
        //console.log(await ratingData.remove('644a21d77da3cea481dea2e6','63fed8db5fcdd3d13159a0f5'))
        //console.log(await ratingData.getAll('644a21d77da3cea481dea2e6'))
        //console.log(await ratingData.get('644a21d77da3cea481dea2e6','63fed8db5fcdd3d13159a0f4'))
        //console.log(await gameData.updateGame('642a12913884b92cf5f2c801','COD',['Shooter'],'Sample description',['Requirements'],'Teen'))
        //console.log(game)
        
    }catch(e){
        console.log(e)
    }
}
await main();
await closeConnection();
