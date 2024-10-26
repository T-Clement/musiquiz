const express = require('express');
const router = express.Router();


const User = require('../models/User');


const Game = require('../schema/Game');

// router.post(...)


router.get('/:id', async (req, res, next) => {

    // create websocket instance / room // chanel

    const {id} = req.params;


    console.log("in /game/:id");

    const game = await Game.findById(id);


    console.log(game);
    if(!game) {
        return res.status(404).json({message: "Game not found"});
    }



    
    return res.status(200).json({game: game}); 

    

    // return data from room



});


router.post('/check-sharing-code', async (req, res, next) => {

    const { sharingCode } = req.body;


    const filter = { sharingCode: sharingCode };


    try {

        const game = await Game.findOne(filter);

        if(!game) {
           return res.status(404).json({message: "Pas de partie en cours avec ce code"});
        }

        return res.status(200).json({message: "", game: game});


    } catch(error) {
        console.log('Error in check sharing code ', error);
        res.status(500).json({message: "Error in check sharing code"});
    }

});




router.post('/add-user-to-game', async (req, res, next) => {

    try {
        
        // put body data in variables
        const { gameId, userId, role, socketId } = req.body;
        
        // SQL DATA
        const userData = await User.getUserForGame(userId);


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
    
        const updatedGame = await Game.findOneAndUpdate(filter, update);
        
        console.log("User added");
        console.log(`Game ${gameId} updated`, updatedGame);


        if(!updatedGame) {
            return res.status(404).json({message: "Game not found"});
        }

        

        return res.status(200).json({message: "Player and role updated successfully", game: updatedGame, role: role, user: role === "player" ?  {userId: userData.id, pseudo: userData.pseudo} : {} });

    } catch (error) {
        console.error("Error updating game role: ", error);
        res.status(500).json({message: "Error updating game role"});


    }
});


router.delete('/:id/delete', async(req, res, next) => {


    const gameId = req.params.id;
    
    try {
        const deletedGame = await Game.findByIdAndDelete(gameId);
    
        if(!deletedGame) {
            return res.status(404).json({message: "Game not found"});
        }



        return res.status(201).json({message: "Game successfully deleted"});

    } catch (error) {
        console.error("Error during Game delete action : ", error);
    }

})









module.exports = router;