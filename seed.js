import {closeConnection,dbConnection} from './config/mongoConnection.js'
import {gameData} from './data/index.js'

async function main(){
    const db = await dbConnection();
    try{ 
        let game=undefined;
        game=await gameData.createGame('02/02/1990','COD',['Shooter'],'Sample description','Requirements','PG-13')
        console.log(game)
    }catch(e){
        console.log(e)
    }
}
await main();
await closeConnection();
