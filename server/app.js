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

app.post('/api/login', validateLogin, (req, res, next) => {

    const errors = validationResult(req);

    // check if user and password field are in req
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors : errors.array() })
    }

    // get validated data
    const validatedData = matchedData(req);
    
    const { pseudo, password } = validatedData;


    // check for match of user in database





    res.status(200).json({ message : "data received" });

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

