require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const cookies = require("cookie-parser");

// routes
const userRoutes = require('./routes/user');
const themeRoutes = require('./routes/theme');
const roomRoutes = require('./routes/room');
const gameRoutes = require('./routes/game');
const authRoutes = require('./routes/auth');
const resetPasswordRoutes = require('./routes/reset-password');
const homeRoutes = require('./routes/home');
// controller for specific route
// const gameController = require('./controllers/gameSQL');

// middlewares
// const cache = require('./middleware/cache');


const app = express();


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(helmet()); // security middleware to set various HTTP headers
app.use(cookies());


app.use(cors({
    origin: process.env.FRONT_URL,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
}));



// CSRF ???



// use to check api healthcheck
app.get('/api/ping', (req, res) => {
    res.status(200).json({ message: 'pong' })
})


// routes
app.use(authRoutes);
app.use('/api/user/', userRoutes);
// app.get('/api/top3', cache("musiquiz.top3"), gameController.top3);
app.get('/api/top3', homeRoutes);
app.use('/api/theme/', themeRoutes);
app.use('/api/room/', roomRoutes);
app.use('/api/game', gameRoutes);
app.use(resetPasswordRoutes);


// error handling middleware
app.use((err, req, res, next) => {
    console.log("In error middleware in app");
    console.log(err);
    console.error(err.stack);
    res.status(err.status || 500).json({ message: err.message });
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