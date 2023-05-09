import {closeConnection,dbConnection} from './config/mongoConnection.js'
import {gameData,userData} from './data/index.js'
import { gameListData } from "./data/index.js";
import {createComment,getpartComment,deleteComment,updateComment,getCommentById,likeComment,dislikeComment,reportComment} from './data/comment.js'
import ratingData from './data/individualRatings.js'
import games from './data/games.js';
import path from 'path';
import {v4 as uuidv4} from 'uuid';
import fs from 'fs';



async function main(){
    const db = await dbConnection();
    try{ 
        const games=[];
        games[0]=await gameListData.createGame('01/01/2020', 'Call of Duty', 'Shooter', 'Call of Duty is a first-person shooter video game franchise published by Activision. Starting out in 2003, it first focused on games set in World War II. Over time, the series has seen games set in the midst of the Cold War, futuristic worlds, and the modern day.', 'RAM: 16GB', 18, 'ps5');
        games[1]=await gameListData.createGame('02/01/2020', 'Valorant', 'Shooter', 'Valorant is a team-based first-person tactical hero shooter set in the near future. Players play as one of a set of Agents, characters based on several countries and cultures around the world. In the main game mode, players are assigned to either the attacking or defending team with each team having five players on it.', 'RAM: 8GB', 15, 'pc');
        games[2]=await gameListData.createGame('03/01/2020', 'Need for speed', 'Racing', 'Need for Speed (NFS) is a racing game franchise published by Electronic Arts and currently developed by Criterion Games, the developers of Burnout. The series generally centers around illegal street racing and tasks players to complete various types of races while evading the local law enforcement in police pursuits.', 'RAM: 8GB', 18, 'xbox');
        games[3]=await gameListData.createGame('05/01/2020', 'Counterstrike', 'shoot', 'Counter-Strike (CS) is a series of multiplayer tactical first-person shooter video games in which teams of terrorists battle to perpetrate an act of terror (bombing, hostage-taking, assassination) while counter-terrorists try to prevent it (bomb defusal, hostage rescue, escort mission).', '120 FPS', 13, 'ps5');
        games[4]=await gameListData.createGame('01/01/2021', 'Pokemon', 'Adventure', 'The original Pokémon is a role-playing game based around building a small team of monsters to battle other monsters in a quest to become the best. Pokémon are divided into types, such as water and fire, each with different strengths', '240 FPS', 18, 'ps5');
        games[5]=await gameListData.createGame('01/02/2021', 'F1', 'Ride', 'F1 is a racing video game series by Codemasters under the EA Sports banner since 2021. The series holds the official license of the FIA Formula One World Championship, with the FIA Formula 2 Championship available since the 2019 game.', 'systemRequirements', 18, 'ps5');
        games[6]=await gameListData.createGame('01/04/2022', 'Mario', 'ride', 'description', 'systemRequirements', 13, 'xbox');
        games[7]=await gameListData.createGame('01/01/2022', 'Robot Wars', 'action', 'description', 'systemRequirements', 13, 'ps5');
        games[8]=await gameListData.createGame('01/01/2019', 'Pacman', 'action', 'description', 'systemRequirements', 13, 'ps5');
        games[9]=await gameListData.createGame('01/01/2019', 'Modern Warfare', 'action', 'description', 'systemRequirements', 15, 'pc');
        games[10]=await gameListData.createGame('01/01/2018', 'Raid', 'action', 'description', 'systemRequirements', 15, 'xbox');
        games[11]=await gameListData.createGame('01/01/2017', 'COD Mobile', 'action', 'description', 'Nintendo switch', 15, 'switch');
        games[12]=await gameListData.createGame('01/01/2016', 'game13', 'action', 'description', 'systemRequirements', 13, 'switch');
        games[13]=await gameListData.createGame('01/01/2015', 'game14', 'action', 'description', 'systemRequirements', 13, 'switch');
        games[14]=await gameListData.createGame('01/01/2015', 'game15', 'action', 'description', 'systemRequirements', 13, 'switch');


        const users=[];
        users[0]=await userData.createUser("Admin", 27, "admin@gmail.com", "Password@1", "admin");
        users[1]=await userData.createUser("Caraxes", 27, "test1@gmail.com", "Password@1");
        users[2]=await userData.createUser("Scarlett", 13, "test2@gmail.com", "Password@1");
        users[3]=await userData.createUser("Korra", 17, "test3@gmail.com", "Password@1");
        users[4]=await userData.createUser("Baba", 18, "test4@gmail.com", "Password@1");
        users[5]=await userData.createUser("Nnita", 24, "test5@gmail.com", "Password@1");
        users[6]=await userData.createUser("Babel", 23, "test6@gmail.com", "Password@1");
        users[7]=await userData.createUser("Basilisk", 42, "test7@gmail.com", "Password@1");
        users[8]=await userData.createUser("Ramu Kaka", 51, "test8@gmail.com", "Password@1");
        users[9]=await userData.createUser("T4rik", 66, "test9@gmail.com", "Password@1");
        users[10]=await userData.createUser("K1ng", 29, "test10@gmail.com", "Password@1");
        users[11]=await userData.createUser("Heng Zhao", 22, "test11@gmail.com", "Password@1");
        users[12]=await userData.createUser("Trump", 70, "test12@gmail.com", "Password@1");
        users[13]=await userData.createUser("Obama", 70, "test13@gmail.com", "Password@1");
        users[14]=await userData.createUser("Biden", 100, "test14@gmail.com", "Password@1");
        

        const comments = [
            "Gaming is not a hobby, it's a passion.",
            "Life is short, but the hours spent gaming are never wasted.",
            "In gaming, there's no such thing as too much fun.",
            "Video games are not just a pastime, they're a lifestyle.",
            "Winning isn't everything, but it sure feels good in gaming.",
            "The beauty of gaming is that it's a never-ending adventure.",
            "Gaming is the ultimate form of escapism.",
            "Games are like books, but interactive and more immersive.",
            "A bad day of gaming is still better than a good day at work.",
            "Gaming brings people together from all over the world.",
            "There's always a new adventure waiting in the world of gaming.",
            "The greatest thing about gaming is that you can be whoever you want to be.",
            "Gaming is a way to experience things you could never do in real life.",
            "A true gamer never gives up, even when faced with a difficult challenge.",
            "The beauty of gaming is that it's always evolving and getting better."
          ];
        const pics=[];
        for(var i=0;i<7;i++)
        {
            pics[i]=path.join('./seedpics',i+'.jpg');
        }
        const commentobj=[];
        for(var i=0;i<100;i++)
        {
            let randomuser = Math.floor(Math.random() * 15);
            let randomgame = Math.floor(Math.random() * 15);
            let randomcomment = Math.floor(Math.random() * 15);
            let randompics=Math.floor(Math.random()*7);
            const picName = uuidv4() ;
            const imgpath=path.join('./public', 'userfile', 'comments',picName+'.jpg');
            fs.copyFileSync(pics[randompics], imgpath)
            commentobj[i]=await createComment(users[randomuser]._id,games[randomgame]._id,comments[randomcomment],['/public/userfile/comments/' + picName+'.jpg']);
            if(Math.random()>0.5)
                await reportComment(commentobj[i]._id,users[1]._id);
        }
        await ratingData.addRating(games[0]._id,users[0]._id,'Good game',9);
        await ratingData.addRating(games[0]._id, users[1]._id, 'Great graphics!', 8);
        await ratingData.addRating(games[1]._id, users[2]._id, 'Amazing storyline!', 9);
        await ratingData.addRating(games[1]._id, users[3]._id, 'Average', 6);
        await ratingData.addRating(games[2]._id, users[4]._id, 'Meh', 7);
        await ratingData.addRating(games[2]._id, users[1]._id, 'Loved it!', 10);

        await ratingData.addRating(games[3]._id,users[0]._id,'Good game',9);
        await ratingData.addRating(games[3]._id, users[1]._id, 'Great graphics!', 8);
        await ratingData.addRating(games[4]._id, users[2]._id, 'Amazing storyline!', 9);
        await ratingData.addRating(games[4]._id, users[3]._id, 'Average', 6);
        await ratingData.addRating(games[5]._id, users[4]._id, 'Meh', 7);
        await ratingData.addRating(games[5]._id, users[1]._id, 'Loved it!', 10);

        await ratingData.addRating(games[6]._id,users[0]._id,'Good game',9);
        await ratingData.addRating(games[6]._id, users[1]._id, 'Great graphics!', 8);
        await ratingData.addRating(games[7]._id, users[2]._id, 'Amazing storyline!', 9);
        await ratingData.addRating(games[7]._id, users[3]._id, 'Average', 6);
        await ratingData.addRating(games[8]._id, users[4]._id, 'Meh', 7);
        await ratingData.addRating(games[8]._id, users[1]._id, 'Loved it!', 10);

        await ratingData.addRating(games[9]._id,users[0]._id,'Good game',9);
        await ratingData.addRating(games[9]._id, users[1]._id, 'Great graphics!', 8);
        await ratingData.addRating(games[10]._id, users[2]._id, 'Amazing storyline!', 9);
        await ratingData.addRating(games[10]._id, users[3]._id, 'Average', 6);
        await ratingData.addRating(games[11]._id, users[4]._id, 'Meh', 7);
        await ratingData.addRating(games[11]._id, users[1]._id, 'Loved it!', 10);

        await ratingData.addRating(games[12]._id,users[0]._id,'Good game',9);
        await ratingData.addRating(games[12]._id, users[1]._id, 'Great graphics!', 8);
        await ratingData.addRating(games[13]._id, users[2]._id, 'Amazing storyline!', 9);
        await ratingData.addRating(games[13]._id, users[3]._id, 'Average', 6);
        await ratingData.addRating(games[14]._id, users[4]._id, 'Meh', 7);
        await ratingData.addRating(games[14]._id, users[1]._id, 'Loved it!', 10);
        

        
    }catch(e){
        console.log(e)
    }
}
await main();
await closeConnection();
