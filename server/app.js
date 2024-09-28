require('dotenv').config();
const express = require('express');
const cors = require('cors');

const {v4:uuidv4} = require('uuid');

const cookies = require("cookie-parser");

// const config = require("./config.json");

const mongoose = require('mongoose');
const uri = "mongodb+srv://toquetclement:BkhoRSWPHIm0syqH@musiquiz-rooms.jkx6g.mongodb.net/?retryWrites=true&w=majority&appName=musiquiz-rooms";
const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };
async function run() {
  try {
    // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
    await mongoose.connect(uri, clientOptions);
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await mongoose.disconnect();
  }
}
run().catch(console.dir);





const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// const { body, validationResult, matchedData } = require("express-validator");

const userRoutes = require('./routes/user');
const themeRoutes = require('./routes/theme');
const roomRoutes = require('./routes/room');

const User = require('./models/User');
const utils = require('./utils/utils');


const {authenticateJWT} = require('./middleware/Auth');

const app = express();


app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use(cookies());


app.use(cors({
    // origin: `http://localhost:${process.env.DOCKER_PORT_FRONT}`,
    origin: `http://localhost:${process.env.NODE_ENV === 'prod' ? process.env.DOCKER_PORT_FRONT : 5173}`,
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
    res.status(200).json({message: 'pong'})
})


// validation middleware  
const { body, validationResult, matchedData } = require("express-validator");

const Game = require('./schema/Game');
// const validateCreateRoom = [
//     body('idRoom').isNumeric('L\'identifiant doit être un entier');
// ]



const validateLogin = [
    body('email')
        .trim()
        .escape()
        .isEmail().withMessage('L\'email doit être valide')
        .notEmpty().withMessage('L\'email est requis'),
    body('password')
        .trim()
        .escape()
        .isString().withMessage('Le mot de passe doit être une chaîne de caractères')
        .notEmpty().withMessage('Le mot de passe est requis'),
];

app.post("/api/login", validateLogin, async (req, res, next) => {


    // get errors comming from express-validator
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    // get validated data
    const validatedData = matchedData(req);

    const { email, password } = validatedData;

    console.log(email, password);

    // check if user exists with the credentials comming from post request and validated with validator
    User.findUserByMail(email).then(async user => {
        // no user
        if(user === null) {
            console.log("No user for this email");
            return res.status(401).json({message: "Paire identifiant/mot de passe incorrect"})
        } else {
            // a user with this email has been found
            // check passwords hashs
            const valid = bcrypt.compare(password, user.password)
            
            if(!valid) {
                console.log("Invalid comparison of hashed passwords");
                res.status(500).json({ message: "Paire identifiant/mot de passe incorrect" });
            } else {
                console.log("Match, a user with correct credentials is found");

                user = new User(user.id, user.pseudo, null, user.email, user.createdAt, user.updatedAt);

                try {

                    // generate accessToken
                    const accessToken = await utils.generateAccessToken(user, process.env.JWT_SECRET_KEY, process.env.TOKEN_EXPIRATION);
                    console.log(accessToken);

                    // generate refreshToken
                    const refreshToken = await utils.generateRefreshToken(user, process.env.JWT_REFRESH_SECRET_KEY, process.env.REFRESH_EXPIRATION);
                    console.log(refreshToken);

                    // send cookies
                    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: false}); // secure to true if https
                    // res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: false, sameSite: 'Strict' }); // secure to true if https
                    res.cookie('accessToken', accessToken, {httpOnly: true, secure: false});
                    // res.cookie('jwtToken', accessToken, {httpOnly: true, sameSite: 'Strict'});
                    res.cookie('test', 'test', {secure: false});
                    res.status(200).json({message: "Connexion Réussie", userId: user.id });
                    // res.status(200).json({message: "Connexion Réussie", accessToken: accessToken, refreshToken: refreshToken});
                        

                } catch(error) {
                    console.log("ERROR");
                    console.log(error);
                    res.status(500).json({error});
                }
            }
           
        };
    })
    .catch(error => res.status(500).json({error}));
    

});

app.post('/api/logout', authenticateJWT, (req, res) => {
    // set cookie to passed Date to delete it
    res.cookie('accessToken', '', {
        httpOnly: true,
        expires: new Date(0)
    });
    // set cookie to passed Date to delete it
    res.cookie('refreshToken', '', {
        httpOnly: true,
        expires: new Date(0)
    });

    res.status(200).json({ message: 'Déconnexion réussie, cookies supprimés' });
});

// NOT TESTED
app.get('/api/refresh-token', (req, res) => {



    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return res.status(401).json({ message: 'Non authentifié' });
    }

    // Vérifier le refresh token
    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Refresh token invalide ou expiré' });
        }

        // Générer un nouveau access token
        const newAccessToken = jwt.sign(
            { userId: user.userId, pseudo: user.pseudo, email: user.email }, 
            process.env.JWT_SECRET_KEY, 
            { expiresIn: process.env.TOKEN_EXPIRATION }
        );

        // Stocker le nouveau JWT dans un cookie httpOnly
        res.cookie('accessToken', newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: 15 * 60 * 1000  // 15 minutes en ms
        });

        res.status(200).json({ message: "Token renouvelé !", user: user.id });
    });
});

app.get("/api/me", authenticateJWT, (req, res) => {
    if(!req.user) {
        return res.status(401).json({message: "Non authentifié"});
    }
    res.status(200).json({message: "in user connected route", user: req.user});

})



// routes
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



app.post('/api/create-game', async (req, res, next) => {
    
    
    try {

        console.log(req.body);

        const {roomId} = req.body;
        // console.log(roomId);


        // get data in mysql database
        // api playlist id, name
        



        // to store in mongoDb
        const gameId = uuidv4();

        const newGame = new Game({
            _id: gameId,
            roomId: parseInt(roomId),
            status: 'waiting',
            createdAt: new Date()
        });


        await newGame.save();

        res.status(201).json({ gameId: newGame._id })



    } catch (error) {
        console.error('Error creating new Game', error);
        res.status(500).json({error: 'Failed to create game'});
    }
});

app.get('/api/game/:id', async (req, res, next) => {

    // create websocket instance / room // chanel

    const {id} = req.params;

    const game = await Game.findById(id);

    if(!game) {
        return res.status(404).json({message: "Game not found"});
    }



    
    return res.status(200).json({game: game}); 

    

    // return data from room



});


app.post('/api/add-user-to-game', async (req, res, next) => {

    try {
        
        const { gameId, userId, role } = req.body;
        
        const filter = { _id: gameId };
        console.log(gameId);
        let update = {};
        
        // get user id and put it in game to presentator or in user Array
        if(req.body.role === "player") {
            update = { $addToSet: { players: userId } }
    
        } else if (req.body.role === "presentator") {
            update = { $set: { presentator: userId } }
        } else {
            return res.status(400).json({message: "Invalid role specified"});
        }
    
        const updatedGame = await Game.findOneAndUpdate(filter, update);
        console.log(updatedGame);
        if(!updatedGame) {
            return res.status(404).json({message: "Game not found"});
        }

        return res.status(200).json({message: "Player and role updated successfully", game: updatedGame });

    } catch (error) {
        console.error("Error updating game role: ", error);
        res.status(500).json({message: "Error updating game role"});


    }
});


// error handling middleware
app.use((err, req, res, next) => {
    console.log("In error middleware");
    console.log(err);
    console.error(err.stack);
    res.status(500).json({ message: err.message});
});




// 404 route to place at the end
app.get('*', (req, res, next) => {
    res.status(404).json({ message : "404, ressource not found" })
})


module.exports = app; // export pour pouvoir avoir accès à cette constante depuis les autres fichiers, notamment celui de notre server Node




// check if user is not already in room before launching one.
// avoid users to be connected on multiples devices
// add a table in database to allow a way to revoke refresh tokens
// update to postgre instead of mysql
// add a csrf cookie to each post route to avoid CSRF attacks with the use of http-only cookies || add option 'SameSite' to cookies