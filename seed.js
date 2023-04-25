import {closeConnection,dbConnection} from './config/mongoConnection.js'
import {gameData} from './data/index.js'

async function main(){
    const db = await dbConnection();
    try{ 
        //let game=undefined;
        //game=await gameData.createGame('02/02/1970','COD',['Shooter'],'Sample description',['Requirements'],'Teen')
        console.log(await gameData.updateGame('642a12913884b92cf5f2c801','COD',['Shooter'],'Sample description',['Requirements'],'Teen'))
        //console.log(game)
    }catch(e){
        console.log(e)
    }
}
await main();
await closeConnection();
