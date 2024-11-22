require('dotenv').config();
const http = require('http'); // va permetttre de créer un serveur
const app = require('./app');
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
  // -------------------------------------
  socket.on('join-room', async (gameId, userId, role) => {

    console.log("dans la connection socket");

    const socketId = socket.id;

    // comportement différent selon joueur ou présentateur
    console.log(gameId, userId, role);


    try {
      // console.log(gameId);
      const game = await Game.findById(gameId); // Mongoose Schema
      const user = await User.getUserForGame(userId); // SQL Object

      console.log(game, user);
      if (!game) {
        console.error(`Game not found : ${gameId}`);
        return;
      }

      // add role to socket 
      socket.role = role;

      // associate websocket in game 
      socket.join(gameId);



      console.log(`Socket ${socket.id} (user: ${user?.pseudo}) rejoint la room : ${gameId} avec le role : ${socket.role}`);


      if (role === 'player') {

        // add socketId to user in database
        await Game.updateOne(
          { _id: gameId, 'players.userId': userId },
          { $set: { 'players.$.socketId': socket.id } }
        );

        const playerIndex = game.players.findIndex(player => player.userId === userId);
        if (playerIndex !== -1) {
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



      } else if (role === 'presentator') {
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



    } catch (error) {
      console.error("Error in join-room: ", error);
      socket.emit('error', { message: 'Une erreur est survenue lors de la connexion à la room.' });

    }


  });



  // -------------------------------------
  // -------------------------------------
  // ---------------- IN GAME ------------
  // -------------------------------------
  // -------------------------------------


socket.on('prepare-round-presentator', async({gameId, roundNumber}) => {
  try {
    // const roundsData = await Game.findById(gameId, { rounds: 1, totalRounds: 1, currentRound: 1 });

    // io.to(gameId).emit('prepare-round', roundsData); // rounds, 
    
    // console.log(gameId,  roundNumber);


    // console.log("COUCOU");
    // console.log(gameId);
    // console.log("Avant game");
    const game = await Game.findById(gameId);
    // console.log(game);
    // console.log("Après game");
    // console.log("Round Number", roundNumber);
    const roundData = game.rounds[roundNumber];
    // console.log("Round Data", roundData);
    // console.log("Round Data", roundData)

    // send data to players
    io.to(gameId).emit('prepare-round', {
      roundNumber,
      roundData
    });


    // initiliasize playersReady array to empty fot this round
    game.rounds[roundNumber].playersReady = [];
    await game.save();


    
  } catch(error) {
    console.error(`Error during round preparation for game ${gameId} at round ${roundNumber}`);
    
    socket.emit('error', {message: 'Erreur lors de la préparation du round pour la partie : ', gameId});
  }
})


socket.on('player-ready', async ({gameId, userId, roundNumber}) => {
  try {
    const game = await Game.findById(gameId);

    // add player to array of players ready for this round
    if(!game.rounds[roundNumber].playersReady.includes(userId)) {
      game.rounds[roundNumber].playersReady.push(userId);

      await game.save();
    }


    // check if all players are ready
    const allPlayersReady = game.players.every(player => 
      game.rounds[roundNumber].playersReady.includes(player.userId)
    );


    if(allPlayersReady) {
      // send event / notify presentator that all players are ready
      // const presentatorSocketId = game.presentator.socketId;


      // notify all users in room that all players are ready
      io.to(gameId).emit('all-players-ready', {roundNumber});
    }



  } catch(error) {
    console.error('Error in player ready / all players ready: ', error);
  }
})

socket.on('start-round', ({gameId, roundNumber}) => {
  // notify players that the round as begin
  io.to(gameId).emit('start-round-players', {roundNumber});
})


socket.on('submit-answer', async ({ gameId, userId, roundNumber, choiceId }) => {


  try {

    const game = await Game.findById(gameId);

    game.rounds[roundNumber].playersResponses.push({
      userId, 
      userChoice: choiceId,
      // time
    })

    await game.save();

    // notify socket player owner
    
    
    // notify presentator
    io.to(game.presentator.socketId).emit("player-responsed", {userId});




  } catch(error) {
    console.error('Error in submit-answer:', error);
    socket.emit('error', { message: 'Erreur lors de la soumission de la réponse.' });  
  }

  // store choice in database



  // emit socket event to trigger a rendering update to show 
  // in presentator view that the user made a guess




  // event only to presentator ?? -> request ?
  // -> update and get last updated document


});




// socket.on('get-room-sockets', (roomId) => {
//   const room = io.sockets.adapter.rooms.get(roomId);

//   if(room) {
//     const sockets = Array.from(room); // convert Set to Array

//     socket.emit("room-sockets-list", sockets);
//   } else {
//     console.log(`La room ${roomId} est vide ou n'existe pas`);
//     socket.emit("room-sockets-list", []);
//   }

// })


// io.in(roomId).emit('updateLeaderrBoard', leaderBoard);



  socket.on('get-room-players', async(gameId) => {
    const game = await Game.findById(gameId);

    const players = game.players;

    // respond only to the socket who makes the event ????
    socket.emit('room-players-list', players);

  });



  // event submited only if role is set to presentator
  socket.on('launch-game', async (gameId) => {

    // return quickly if socket role is not set to presentator
    if (socket.role !== "presentator") {
      // error event

      // socket.emit('error');


      console.error(`Socket ${socket.id} tente une action (launch game) avec le mauvais role`);
    }


    try {

      // select game document
      const filter = { _id: gameId };

      // update status of game
      const update = {
        $set: { status: "in_progress" }
      };

      // update document to put status at 'in-progress'
      const updatedGame = await Game.findOneAndUpdate(filter, update, { projection: {}, new: true });


      // get presentator ID
      // const userId = await computeUserIdFromHeaders(socket);


      // emit to presentator with 
      // io.to(userId).emit("move-in-game", {rounds: updatedGame.rounds, role: socket.role});

      // emit to players (except presentator)
      // socket.broadcast.to(gameId).emit('move-in-game', {role: socket.role} );


      // emit event to all users in this game
      // send socket id of presentator
      io.to(gameId).emit("move-in-game");




    } catch (error) {
      // emit error event ??
      console.error(`Error in launch game socket event listener : `, error);

    }
    
    
  });
  
  
  socket.on('request-extracts', async ({gameId}) => {

    console.log("in le request-extracts event", gameId);

    const gameExtracts = await Game.findById(gameId, { rounds: 1, totalRounds: 1 });

    socket.emit('receive-extracts', gameExtracts);
  })


  socket.on('load-to-player-round-data', async ({gameId, currentRound}) => {

    const conditions = {};

    const projection = {};

    const currentRoundChoices = await Game.findOne(gameId,)


  })



  // socket.on('start-round', async (gameId, roundIndex) => {

  //   io.to(gameId).emit('start-round', { roundIndex });

  // });



  socket.on('round-end', () => {

    // animate / update leaderboard and show updating scores


    //





  })

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
        _id: gameId
      };

      console.log("la partie");
      console.log(filterPullPlayer);

      const updatePullPlayer = {
        $pull: {
          players: { userId: userId }
        }
      };

      const result = await Game.updateOne(filterPullPlayer, updatePullPlayer);

      console.log(result);

      if (result.modifiedCount > 0) {
        console.log(`Player ${userId} has been removed from the game ${gameId}`);

        // notify other users in room
        io.to(gameId).emit('update-players', { userId, action: 'left' });
        // io.to(gameId).emit('player-left', userId);

      } else {
        console.log("no updates in game collection");
      }

    } catch (error) {

      console.error("Error in player-left : ", error);

    }

  })


  socket.on('presentator-left', async (gameId) => {
    try {

      const filterPullPresentator = {
        _id: gameId
      };

      const updatePullPresentator = {
        $set: {
          presentator: null
        }
      };


      const result = await Game.updateOne(filterPullPresentator, updatePullPresentator);

      console.log("before presentator result.modified");
      console.log(result);
      if (result.modifiedCount > 0) {
        console.log(`Presentator leaved game ${gameId}`);

        // notify other users in room
        io.to(gameId).emit('presentator-left', { action: 'left' });

      }

    } catch (error) {
      console.error('Error in presentator-left : ', error);
    }
  })


  socket.on('delete-game', (gameId) => {

    // emit to all socket in room to quit game
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
