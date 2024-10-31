require('dotenv').config();
const http = require('http'); // va permetttre de créer un serveur
const app = require ('./app');
const { error } = require('console');

const { Server } = require('socket.io');

const normalizePort = val => {
    const port = parseInt(val, 10);
  
    if (isNaN(port)) {
      return val;
    }
    if (port >= 0) {
      return port;
    }
    return false;
};
// console.log("ici");

console.log("FRONT " + process.env.DOCKER_PORT_FRONT);
console.log("SERVER API " + process.env.DOCKER_PORT_API);

const port = normalizePort(process.env.DOCKER_PORT_API); // get port from env variables
app.set('port', port); // set port of app server


/**
 * This function search for errors and handle some of it
 * @param {*} error 
 */
const errorHandler = error => {
  console.log("In server.js error handler");
    if (error.syscall !== 'listen') {
        throw error;
    }
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe' + address : 'port: ' + port;

    switch (error.code) {
        case 'EACCES': 
            console.error(bind + 'requires elevated privileges');
            process.exit(1);
            break;


        case 'EADDRINUSE':
            console.error(bind + 'is already in use.');
            process.exit(1);
            break;

        default: 
        throw error;
    }
};


const Game = require('./schema/Game');
const User = require('./models/User');

const server = http.createServer(app);


const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

io.on("connection", (socket) => {
  console.log("Nouvelle connexion WS établie : ", socket.id);


  // -------------------------------------
  // -------------------------------------
  // ---------------- JOIN ROOM ----------
  // -------------------------------------
  // -------------------------------------
  socket.on('join-room',  async (gameId, userId, role) => {

    console.log("dans la connection socket");

    const socketId = socket.id;

    // comportement différent selon joueur ou présentateur
    console.log(gameId, userId, role);
    
    
    try {
      // console.log(gameId);
      const game = await Game.findById(gameId); // Mongoose Schema
      const user = await User.getUserForGame(userId); // SQL Object

      console.log(game, user);
      if(!game) {
        console.error(`Game not found : ${gameId}`);
        return;
      }

      // associate websocket in game 
      socket.join(gameId);



      console.log(`Socket ${socket.id} (user: ${user?.pseudo}) rejoint la room : ${gameId}`);
      

      if(role === 'player') {

        // add socketId to user in database
        await Game.updateOne(
          { _id: gameId, 'players.userId': userId },
          { $set: { 'players.$.socketId': socket.id } }
        );

        const playerIndex = game.players.findIndex(player => player.userId === userId);
        if(playerIndex !== -1) {
          // game.players[playerIndex].socketId = socket.id;

          await Game.updateOne(
            { _id: gameId, 'players.userId': userId },
            { $set: { 'players.$.socketId': socket.id } }
          );

        }     

        socket.broadcast.to(gameId).emit('player-joined', {
          userId: user.id,
          pseudo: user.pseudo,
          role: role,
          socketId: socketId
        });


        
      } else if(role === 'presentator') {
        // game.presentator = {userId, socketId: socket.id};  

        // if already a presentator, request is not possible
        // if(game.presentator) {
        //   console.error(`Game ${gameId} already has a presentator.`);
          
        //   // socket or res of a post ?
        //   // socket.emit('error', {message: 'Un présentateur est déjà connecté à cette partie.'});
        // }
        
        
        await Game.updateOne(
          { _id: gameId },
          { $set: { presentator: { userId, socketId: socket.id } } }
        );


        socket.broadcast.to(gameId).emit('presentator-joined', {
          userId: userId, // can be null
          role: role
        });




      } 
      
      
      // send to all clients websocket instance in this room
      console.log(`emit to game ${gameId} : a new ${role} has joined the room`);
      
      
      // socket.broadcast.to(gameId).emit('player-joined', { socketId: socket.id, userId: user.id, pseudo: user.pseudo,  });
      
 

    } catch(error) {
      console.error("Error in join-room: " , error);
      socket.emit('error', { message: 'Une erreur est survenue lors de la connexion à la room.' });

    }
    

  });

  // -------------------------------------
  // -------------------------------------
  // ---------------- PLAYER-LEFT ----------
  // -------------------------------------
  // -------------------------------------
  socket.on('player-left', async (gameId, userId, socketId) => {
    console.log('player-left');
    console.log(gameId, userId);

    try {
      const filterPullPlayer = {
        _id : gameId
      };
    
      console.log("la partie");
      console.log(filterPullPlayer);

      const updatePullPlayer = {
        $pull: {
          players: {userId: userId}
        }
      };
  
      const result = await Game.updateOne(filterPullPlayer, updatePullPlayer);
  
      console.log(result);
  
      if(result.modifiedCount > 0) {
        console.log(`Player ${userId} has been removed from the game ${gameId}`);
      
        // notify other users in room
        io.to(gameId).emit('update-players', { userId, action: 'left'});
        // io.to(gameId).emit('player-left', userId);
      
      } else {
        console.log("no updates in game collection");
      }

    } catch(error) {

      console.error("Error in player-left : ", error);

    }

  })


  socket.on('presentator-left', async (gameId) => {
    try {

      const filterPullPresentator = {
        _id : gameId
      };
    
      const updatePullPresentator = {
        $set: {
          presentator: null
        }
      };


      const result = await Game.updateOne(filterPullPresentator, updatePullPresentator);
  
      console.log("before presentator result.modified");
      console.log(result);
      if(result.modifiedCount > 0) {
        console.log(`Presentator leaved game ${gameId}`);
      
        // notify other users in room
        io.to(gameId).emit('presentator-left', { action: 'left'});
      
      }

    } catch (error) {
      console.error('Error in presentator-left : ', error);
    }
  })


  socket.on('delete-game', (gameId) => {
    socket.broadcast.to(gameId).emit('quit-game', {
      message: "La partie a été supprimée, retour vers la page d'accueil."
    });
  })


  socket.on('disconnect', () => {
    console.log(`Socket ${socket.id} s'est déconnectée`);
  })

});





server.on('error', errorHandler);
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
});

server.listen(port);


const mongoose = require('mongoose');
const uri = "mongodb+srv://toquetclement:" + process.env.SECRET_MONGODB_ATLAS + "?retryWrites=true&w=majority&appName=musiquiz-rooms";
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
