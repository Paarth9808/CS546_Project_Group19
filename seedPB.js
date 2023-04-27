import {closeConnection,dbConnection} from './config/mongoConnection.js'
import {userData} from './data/index.js'

async function main(){
    const db = await dbConnection();
    await db.dropDatabase();
    let user3 = undefined;
    // user1
    try{ 
        console.log(await userData.createUser("Gamer01", 18, "pbadola1@gmail.com", "Password@123"));
    }catch(e){
        console.log(e)
    }
    //user2
    try{ 
        console.log(await userData.createUser("Gamer02", 22, "messi98@gmail.com", "Password@123"));
    }catch(e){
        console.log(e)
    }
    //user3
    try{ 
        user3 = await userData.createUser("Gamer03", 13, "mileyB@gmail.com", "Password@123");
        console.log(user3);
    }catch(e){
        console.log(e)
    }
    //all user
    try{ 
        console.log(await userData.getAllUsers());
    }catch(e){
        console.log(e)
    }
    //updateAvatar
    try{ 
        console.log(await userData.updateAvatar(user3._id.toString() , 'img.png'));
    }catch(e){
        console.log(e)
    }
    //getId
    try{ 
        console.log("see");
        console.log(await userData.getUserById(user3._id.toString()));
    }catch(e){
        console.log(e)
    }
    //remove/delete = working
    // try{ 
    //     console.log(await userData.deleteUser(user3._id.toString()));
    // }catch(e){
    //     console.log(e)
    // }
    // edit user
    try{ 
        console.log(await userData.updateUser(user3._id.toString() , "gamer4", 21, "pass@123qwerty"));
    }catch(e){
        console.log(e)
    }
    // // updateReview
    // try{ 
    //     console.log(await userData.updateAvatar(user3._id.toString() , 'img.png'));
    // }catch(e){
    //     console.log(e)
    // }
    // // updateRating
    // try{ 
    //     console.log(await userData.updateAvatar(user3._id.toString() , 'img.png'));
    // }catch(e){
    //     console.log(e)
    // }
}
await main();
await closeConnection();
