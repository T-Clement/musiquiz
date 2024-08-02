const express = require('express');

// const config = require("./config.json");

// const mongoose = require('mongoose');

const userRoutes = require('./routes/user');

  
 

const app = express();



app.use(express.json());


app.use((req, res, next) => { // middleware pour le CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});


// routes
app.use('/api/user/', userRoutes);




module.exports = app; // export pour pouvoir avoir accès à cette constante depuis les autres fichiers, notamment celui de notre server Node

