const express = require('express');
const router = express.Router();


const User = require('../models/User');


const Game = require('../schema/Game');

// router.post(...)


router.get('/:id', async (req, res, next) => {

    // create websocket instance / room // chanel

    const {id} = req.params;

    const game = await Game.findById(id);

    if(!game) {
        return res.status(404).json({message: "Game not found"});
    }



    
    return res.status(200).json({game: game}); 

    

    // return data from room



});


router.post('/add-user-to-game', async (req, res, next) => {

    try {
        
        // put body data in variables
        const { gameId, userId, role } = req.body;
        

        const userData = await User.getUserForGame(userId);


        const filter = { _id: gameId };
        console.log(gameId);
        let update = {};
        
        // get user id and put it in game to presentator or in user Array
        if(role === "player") {
            update = { $addToSet: { players: {userId: userData.id, pseudo: userData.pseudo} } };
    
        } else if (role === "presentator") { // NEED TO BE UPDATED
            update = { $set: { presentator: userId } };
        } else {
            return res.status(400).json({message: "Invalid role specified"});
        }
    
        const updatedGame = await Game.findOneAndUpdate(filter, update);
        console.log(updatedGame);
        if(!updatedGame) {
            return res.status(404).json({message: "Game not found"});
        }

        return res.status(200).json({message: "Player and role updated successfully", game: updatedGame, role: role, user: role === "player" ?  {userId: userData.id, pseudo: userData.pseudo} : {} });

    } catch (error) {
        console.error("Error updating game role: ", error);
        res.status(500).json({message: "Error updating game role"});


    }
});









module.exports = router;