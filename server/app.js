require('dotenv').config();
const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const cookies = require("cookie-parser");

// const config = require("./config.json");





// const { body, validationResult, matchedData } = require("express-validator");

const userRoutes = require('./routes/user');
const themeRoutes = require('./routes/theme');
const roomRoutes = require('./routes/room');
const gameRoutes = require('./routes/game');
const authRoutes = require('./routes/auth');

// const User = require('./models/User');




const app = express();


app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cookies());


app.use(cors({
    // origin: `http://192.168.1.26:5173`,
    // origin: `http://192.168.2.113:5173`,
    origin: process.env.FRONT_URL,
    // origin: `*`,
    // origin: `http://localhost:${process.env.NODE_ENV === 'prod' ? process.env.DOCKER_PORT_FRONT : 5173}`,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
}));


// app.use((req, res, next) => { // middleware pour le CORS
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
//     next();
// });
// console.log(`http://localhost:${process.env.DOCKER_PORT_FRONT}`);



// CSRF 

// use to check api healthcheck
app.get('/api/ping', (req, res) => {
    res.status(200).json({ message: 'pong' })
})


// validation middleware  
const { body, validationResult, matchedData } = require("express-validator");

const Game = require('./schema/Game');
const { default: mongoose } = require('mongoose');
// const validateCreateRoom = [
//     body('idRoom').isNumeric('L\'identifiant doit être un entier');
// ]






// routes

app.use(authRoutes);

app.use('/api/user/', userRoutes);



app.get('/api/top3', async (req, res, next) => {
    const pool = require("./db");
    const Room = require("./models/Room");
    const Game = require("./models/Game");
    const User = require('./models/User');

    // big query who gets the 3 must played rooms and the current bestscore Game of each of this rooms
    const query = `
        SELECT g.id AS game_id, g.date_score, r.id AS room_id, u.id AS user_id, u.pseudo, g.score as current_bestscore, gp.games_played
        FROM ${Game.tableName} g
        JOIN ${User.tableName} u ON g.id_user = u.id
        JOIN ${Room.tableName} r ON g.id_room = r.id
        JOIN (
            SELECT id_room, COUNT(id) as games_played
            FROM ${Game.tableName}
            GROUP BY id_room
        ) gp ON r.id = gp.id_room
        WHERE g.score = (
            SELECT MAX(score)
            FROM ${Game.tableName}
            WHERE id_room = r.id
        )
        GROUP BY r.id, u.id, u.pseudo, g.id, g.date_score, g.score, gp.games_played
        ORDER BY gp.games_played DESC
        LIMIT 3;
    `;

    try {
        const [rows, fields] = await pool.execute(query, []);

        const top3 = await Promise.all(rows.map(async (row) => {
            let room = null;

            let game = new Game(row.game_id, row.current_bestscore, null, row.user_id, row.room_id);

            // name of room
            room = await Room.findOneRoomById(game.getRoomId());
            room.name = room.getName();

            // user name of game
            let user = await User.findOneUserById(game.getUserId());
            game.pseudo_user = user.getPseudo();

            // add game data to room object
            room.game = game;

            return room;
        }));


        res.status(200).json(top3);

    } catch (error) {
        console.error('Error getting room games: ' + error.message);
        next(error);
    }

});



app.use('/api/theme/', themeRoutes);
app.use('/api/room/', roomRoutes);


app.use('/api/game', gameRoutes);

app.post('/api/create-game', async (req, res, next) => {


    try {
        // SQL Model
        const Room = require("./models/Room");

        // console.log(req.body);

        const { roomId } = req.body;
        // console.log(roomId);


        // get data in mysql database
        // api playlist id, name, ..
        const roomData = await Room.findOneRoomById(roomId, true);


        //-------------------------------------------------------------------------------
        // prepare datas for game rounds


        // to update in the future when customs games will be deployed
        const roundsNumber = 10;
        const numberOfResponsePropositions = 4;

        // console.log("API MUSIC PROVIDER CALL");


        // fetch data of playlist in music provider
        const apiMusicResponse = await fetch(`https://api.deezer.com/playlist/${roomData.api_id_playlist}`);
        // console.log()


        if (!apiMusicResponse) {
            const errorBody = await apiMusicResponse.text();
            console.error('Erreur API Deezer :', {
                status: apiMusicResponse.status,
                statusText: apiMusicResponse.statusText,
                responseBody: errorBody,
            });
            throw new Error(`Erreur API Deezer: ${apiMusicResponse.status} - ${apiMusicResponse.statusText}`);
        }


        const apiMusicData = await apiMusicResponse.json();
        // console.log(apiMusicData);

        if (!apiMusicData || !apiMusicData.tracks) {
            throw new Error('Impossible de récupérer les données de la playlist depuis l\'API');
        }


        // check if there is enough tracks to play game with the settings setted
        function checkIfTrackIsReadable(listOfTracks) {
            return listOfTracks.filter(track => track.readable && track.preview && track.preview != '');
        }


        const listOfTracks = checkIfTrackIsReadable(apiMusicData.tracks.data);


        // check if enough game are available
        // each track can only be used 1 time as a choice, after that it's removed from trackList pool
        if (listOfTracks.length < numberOfResponsePropositions * roundsNumber) {

            const gameId = uuidv4();

            // // store game with failing infos
            const newGame = new Game({
                _id: gameId,
                roomId: parseInt(roomId),
                status: 'failed',
                createdAt: new Date(),
                playlistId: roomData.api_id_playlist,
                roomName: roomData.name,
                roomDescription: roomData.description,
                totalRounds: roundsNumber,
                message: `Not enough tracks available and redabled, required : ${numberOfResponsePropositions * roundsNumber}    available: ${listOfTracks.length} `
            });

            await newGame.save();

            return res.status(400).json({
                error: "Il n'y a pas assez de pistes disponibles pour lancer une partie",
                message: `Requis : ${numberOfResponsePropositions * roundsNumber}, disponibles : ${listOfTracks.length}`
            });

        }





        function shuffle(array) {
            return array.sort(() => Math.random() - 0.5);
        }

        function getRandomIncorrectChoices(tracks, correctAnswer, numberOfChoices) {
            // const incorrectTracks = tracks.filter(track => track.title !== correctAnswer && track.preview && track.preview !== '');
            const incorrectTracks = tracks.filter(track => track.title !== correctAnswer);
            const shuffledIncorrectTracks = shuffle(incorrectTracks);
            return shuffledIncorrectTracks.slice(0, numberOfChoices).map(track => track.title);
        }




        // ------------------------------------------------------
        // REGISTER NEW DOCUMENT IN MONGODB
        // ------------------------------------------------------

        // to store in mongoDb
        const gameId = uuidv4();


        let availableTracks = listOfTracks;

        const rounds = [];

        for (let i = 0; i < roundsNumber; i++) {

            // shuffle tracks
            availableTracks = shuffle(availableTracks);

            // take first item of array as the correct answer + remove it from availableTracks array
            const correctTrack = availableTracks.shift();


            // generate ObjectId
            const choiceId = new mongoose.Types.ObjectId();

            // add _id to correctTrack
            correctTrack.choiceId = choiceId;

            const incorretChoices = [];

            // shift from songs pool a song and push it to incorrectChoices array fot this round
            for (let j = 0; j < numberOfResponsePropositions - 1; j++) {
                incorretChoices.push(availableTracks.shift());
            }

            // set choices to Object 
            const choices = shuffle([
                {
                    choiceId: choiceId, // set manual generated ObjectId as value wich is the correct track ObjectId
                    artistName: correctTrack.artist.name,
                    title: correctTrack.title_short,

                }, ...incorretChoices.map(track => ({
                    choiceId: new mongoose.Types.ObjectId(),
                    artistName: track.artist.name,
                    title: track.title_short
                }))
            ]);

            rounds.push({
                roundId: new mongoose.Types.ObjectId(),
                audioPreviewUrl: correctTrack.preview,
                choices: choices,
                correctAnswer: correctTrack.choiceId // get correctTrack choiceId as the value
            });
        }

        // store new Game in database
        const newGame = new Game({
            _id: gameId,
            roomId: parseInt(roomId),
            status: 'waiting',
            createdAt: new Date(),
            playlistId: roomData.api_id_playlist,
            roomName: roomData.name,
            roomDescription: roomData.description,
            totalRounds: roundsNumber, // param of game
            rounds: rounds // array of rounds
        });

        // use method of Schema to create random sharing code starting with roomId
        newGame.generateSharingCode();

        await newGame.save();


        res.status(201).json({ gameId: newGame._id })


    } catch (error) {
        console.error('Error creating new Game', error.message);
        // console.error()
        res.status(500).json({ error: 'Failed to create game' });
    }
});




// error handling middleware
app.use((err, req, res, next) => {
    console.log("In error middleware");
    console.log(err);
    console.error(err.stack);
    res.status(500).json({ message: err.message });
});




// 404 route to place at the end
app.get('*', (req, res, next) => {
    res.status(404).json({ message: "404, ressource not found" })
})


module.exports = app; // export pour pouvoir avoir accès à cette constante depuis les autres fichiers, notamment celui de notre server Node




// check if user is not already in room before launching one.
// avoid users to be connected on multiples devices
// add a table in database to allow a way to revoke refresh tokens
// update to postgre instead of mysql
// add a csrf cookie to each post route to avoid CSRF attacks with the use of http-only cookies || add option 'SameSite' to cookies