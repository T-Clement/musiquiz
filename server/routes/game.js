const express = require('express');
const router = express.Router();


// SQL Model
const Room = require("../models/Room");
const User = require('../models/User');

// 
const GameManager = require('../services/GameManager');


// mongoDB Schema
const Game = require('../schema/Game');

// utils functions
const { checkIfTracksAreReadable, shuffle } = require('../utils/utils');
const { v4: uuidv4 } = require('uuid');
const { default: mongoose } = require('mongoose');
const { optionalAuth } = require('../middleware/Auth');
const utils = require('../utils/utils');


const { gameEngine } = require('../services/AppWiring');

 


router.get('/:id', async (req, res, next) => {
    const {id} = req.params;

    console.log("in /game/:id");

    const game = await Game.findById(id, {rounds: 0, playlistId: 0, });

    console.log(game);
    if(!game) {
        return res.status(404).json({message: "Game not found"});
    }

    return res.status(200).json({game: game}); 
});


router.post('/check-sharing-code', async (req, res, next) => {

    const { sharingCode } = req.body;

    // correct code and still in waiting mode
    // only game in waiting mode can be joined so other status are not
    const filter = { sharingCode: sharingCode, status : "waiting" };


    try {

        const game = await Game.findOne(filter, {projection : { _id: 1}});

        if(!game) {
           return res.status(404).json({message: "Pas de partie en cours avec ce code"});
        }

        return res.status(200).json({
            message: "", 
            game: game, 
            sharingCode: sharingCode
        });

    } catch(error) {
        console.log('Error in check sharing code ', error);
        res.status(500).json({message: "Error in check sharing code"});
    }

});




router.post('/add-user-to-game', optionalAuth, async (req, res, next) => {

    try {
        
        // put body data in variables
        const { gameId, role, socketId, sharingCode } = req.body;

        let userId, userData;

        // ----------------------------------------------------
        // check for auth to join game
        // ----------------------------------------------------

        if(role === 'player') {
            // player need to be connected
            if(!req.user) {
                return res.status(401).json({message: 'Authentification requise pour être joueur'});
            }
            userId = req.user.userId;
            userData = await User.getUserForGame(userId);
            if (GameManager.checkIfUserIsAlreadyInOneGame(userId)) {
                return res.status(403).json({ message: 'Vous êtes déjà dans une partie.' });
            }
        } else if (role === "presentator") {
            // presentator but connected
            if(req.user) {
                userId = req.user.userId;
                userData = await User.getUserForGame(userId);
            } else {
                // USER IS NOT CONNECTED
                if(!sharingCode) {
                    return res.status(401).json({ message: 'Code manquant. Le présentateur invité ne peux pas être authentifié' });
                }
                const game = Game.findOne({_id: gameId, sharingCode, status: 'waiting'});
                if(!game) {
                    return res.status(401).json({ message: 'Code invalide. Le présentateur invité ne peux pas être authentifié' });
                }


                userId = null;
            }
        } else {
            return res.status(400).json({ message: 'Role invalide.' });
        }





        // SQL DATA
        // const userData = await User.getUserForGame(userId);

        // // if user is already in a running game, not allowed to join a new room
        // const userAlreadyInGame = GameManager.checkIfUserIsAlreadyInOneGame(userId);
        // if(userAlreadyInGame) {
        //     console.log('user is already in a game ', userAlreadyInGame);
        //     return res.status(403).json({ message : "User is already in a running game"});
        // }

        const filter = { _id: gameId };
        // console.log(gameId);
        let update = {};
        
        // get user id and put it in game to presentator or in user Array
        if(role === "player") {
            update = { $addToSet: { players: {userId: userData.id, pseudo: userData.pseudo, socketId: socketId} } };
    
        } else if (role === "presentator") { // NEED TO BE UPDATED
            update = { $set: { presentator: {userId, socketId: socketId} } };
        } else {
            return res.status(400).json({message: "Invalid role specified"});
        }
    
        const updatedGame = await Game.findOneAndUpdate(filter, update, {projection: {rounds: 0}});
        
        console.log("User added");
        console.log(`Game ${gameId} updated`, updatedGame);


        if(!updatedGame) {
            return res.status(404).json({message: "Game not found"});
        }

        

        return res.status(200).json(
            {
                message: "Player and role updated successfully", 
                game: updatedGame, 
                role: role, 
                user: role === "player" ?  {userId: userData.id, pseudo: userData.pseudo} : {},
                // presentatorToken: presentatorToken 
            }
        );

    } catch (error) {
        console.error("Error updating game role: ", error);
        res.status(500).json({message: "Error updating game role"});


    }
});


router.delete('/:id/delete', async(req, res, next) => {


    const gameId = req.params.id;

    console.log(`${gameId} is proceed to be killed in memory and deleted from database`);

    try {

        // // if gameIsLaunched
        //     const gameState = GameManager.inMemoryGames.get(gameId);
        //     // console.log("before")
        //     // console.log(gameState);
        //     // console.log("after")
        //     if(!gameState) {
        //         return res.status(404).json({ message: "Partie non trouvée ou déjà supprimée.", redirect: "home"});
        //     }
            
        // if game is in memory, delete it
        // kill / clear timeOut of game in Map server
        gameEngine.killGameInstance(gameId);

        // delete the record from the database
        const deletedGame = await Game.findByIdAndDelete(gameId);
    
        if(!deletedGame) {
            return res.status(404).json({message: "Game not found"});
        }



        return res.status(201).json({message: "Game successfully deleted"});

    } catch (error) {
        console.error("Error during Game delete action : ", error);
    }

});


router.post('/create-game', async (req, res, next) => {


    try {


    // console.log(req.body);

    
        // let error = new Error("TEST 404");
        // error.status = 404;
        // throw error;
        
        
        
        const { roomId } = req.body;
        // console.log(roomId);


        // get data in mysql database
        // api playlist id, name, ..
        const roomData = await Room.findOneRoomById(roomId, true);

        //-------------------------------------------------------------------------------
        // prepare datas for game rounds

        // ajouter un log de la quantité des songs filtrées


        // to update in the future when customs games will be deployed
        const roundsNumber = GameManager.roundsNumber;
        const numberOfResponsePropositions = GameManager.numberOfResponsePropositions;


        // ...
        const fetchPlaylistFromDeezer = "";

        // fetch data of playlist in music provider
        const apiMusicResponse = await fetch(`https://api.deezer.com/playlist/${roomData.api_id_playlist}`);


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

        const listOfTracks = checkIfTracksAreReadable(apiMusicData.tracks.data);

        // check if enough game are available
        // each track can only be used 1 time as a choice, after that it's removed from trackList pool
        if (listOfTracks.length < numberOfResponsePropositions * roundsNumber) {

            const gameId = uuidv4();

            // // store game with failing infos
            const newGame = new Game({
                _id: gameId,
                roomId: parseInt(roomId),
                themeId: parseInt(roomData.id_theme),
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
            themeId: parseInt(roomData.id_theme),
            status: 'waiting',
            createdAt: new Date(),
            playlistId: roomData.api_id_playlist,
            roomName: roomData.name,
            roomDescription: roomData.description,
            totalRounds: roundsNumber, // param of game
            rounds: rounds // array of rounds
        });

        // use method of Schema to create random sharing code starting with roomId
        const generatedSharingCode = newGame.generateSharingCode();

        await newGame.save();

        // init Game in memory
        GameManager.inMemoryGames.set(gameId, {
            roomName: roomData.name,
            createdAt: new Date()
        });


        res.status(201).json({ gameId: newGame._id,  sharingCode: generatedSharingCode})


    } catch (error) {
        console.error('Error creating new Game', error.message);
        // console.error()
        next(error)


        // res.status(error.status).json({ error: 'Failed to create game' });
    }

});







module.exports = router;