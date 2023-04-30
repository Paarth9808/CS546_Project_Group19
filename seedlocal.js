import {closeConnection,dbConnection} from './config/mongoConnection.js'
import {userData} from './data/index.js'

async function main(){
    const db = await dbConnection();
    // try{ 
    //     let game=undefined;
    //     game = await userData.createUser("gamer_boi", 18, "pbadola@stevens.edu", "KuchBHi@908")
    // }catch(e){
    //     console.log(e)
    // }
    try{ 
        let game1=undefined;
        game1 = await userData.createUser("gamer_pro", 21, "pbadola1@stevens.edu", "KuchBHi@908", "admin")
    }catch(e){
        console.log(e)
    }
}
await main();
await closeConnection();
