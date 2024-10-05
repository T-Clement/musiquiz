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

  socket.on('join-room',  async (gameId, userId, socketId) => {

    // comportement différent selon joueur ou présentateur
    console.log(gameId, userId, socketId);
    


    const Game = require('./schema/Game');
    const User = require('./models/User');

    
    try {
      const game = await Game.findById(gameId); // Mongoose Schema
      const user = await User.getUserForGame(userId); // SQL Object
      console.log(game, user);
      if(!game) {
        console.error(`Game not found : ${gameId}`);
        return;
      }
      
      
      socket.join(gameId);
      console.log(`Socket ${socket.id} (user: ${user.pseudo}) rejoint la room : ${gameId}`);
      
      // add socketId to user in database
      const playerIndex = game.players.findIndex(player => player.userId === userId);
      if(playerIndex !== -1) {
        game.players[playerIndex].socketId = socket.id;
      } else {
        // // Player doesn't exist, add them to the game
        // game.players.push({
        //   userId: userId,
        //   pseudo: user.pseudo,
        //   socketId: socketId,
        //   score: 0
        // });
      }     


      await game.save();
      
      // send to all clients websocket instance in this room
      io.to(gameId).emit('update-players', { socketId: socket.id, userId: user.id, pseudo: user.pseudo,  });
      
 

    } catch(error) {
      console.error("Error in join-room: " , error);
    }
    

  });

  socket.on('disconnect', () => {
    console.log(`Socket ${socket.id} s'est déconnectée`);
  })

})

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
