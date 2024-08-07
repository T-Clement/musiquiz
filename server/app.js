const express = require('express');

// const config = require("./config.json");

// const mongoose = require('mongoose');

const { body, validationResult, matchedData } = require("express-validator");



const userRoutes = require('./routes/user');
const themeRoutes = require('./routes/theme');
const roomRoutes = require('./routes/room');



// validation middleware  
const validateLogin = [
    body('pseudo')
        .trim()
        .escape()
        .isString().withMessage('Le pseudo doit être une chaîne de caractères')
        .notEmpty().withMessage('Le pseudo est requis'),
    body('password')
        .trim()
        .escape()
        .isString().withMessage('Le mot de passe doit être une chaîne de caractères')
        .notEmpty().withMessage('Le mot de passe est requis'),
];







const app = express();


app.use(express.urlencoded({extended: true}));
app.use(express.json());


app.use((req, res, next) => { // middleware pour le CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});


// routes
app.use('/api/user/', userRoutes);

// app.post('/api/login', validateLogin, (req, res, next) => {

//     const errors = validationResult(req);

//     // check if user and password field are in req
//     if(!errors.isEmpty()) {
//         return res.status(400).json({ errors : errors.array() })
//     }

//     // get validated data
//     const validatedData = matchedData(req);
    
//     const { pseudo, password } = validatedData;


//     // check for match of user in database





//     res.status(200).json({ message : "data received" });

// });

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

// error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: err.message });
});



// 404 route to place at the end
app.get('*', (req, res, next) => {
    res.status(404).json({ message : "404, ressource not found" })
})


module.exports = app; // export pour pouvoir avoir accès à cette constante depuis les autres fichiers, notamment celui de notre server Node

