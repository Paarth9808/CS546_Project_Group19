import {closeConnection,dbConnection} from './config/mongoConnection.js'
import {gameData,userData} from './data/index.js'
import {createComment,getpartComment,deleteComment,updateComment,getCommentById,likeComment,dislikeComment,reportComment} from './data/comment.js'
import ratingData from './data/individualRatings.js'




async function main(){
    const db = await dbConnection();
    try{ 
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
