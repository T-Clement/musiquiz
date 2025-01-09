require("dotenv").config();
const http = require("http"); // va permetttre de créer un serveur
const app = require("./app");
const { error } = require("console");

const { Server } = require("socket.io");

const normalizePort = (val) => {
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
app.set("port", port); // set port of app server

/**
 * This function search for errors and handle some of it
 * @param {*} error
 */
const errorHandler = (error) => {
  console.log("In server.js error handler");
  if (error.syscall !== "listen") {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === "string" ? "pipe" + address : "port: " + port;

  switch (error.code) {
    case "EACCES":
      console.error(bind + "requires elevated privileges");
      process.exit(1);
      break;

    case "EADDRINUSE":
      console.error(bind + "is already in use.");
      process.exit(1);
      break;

    default:
      throw error;
  }
};

const Game = require("./schema/Game");
const User = require("./models/User");

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    // origin: "http://localhost:5173",
    // origin: "http://192.168.1.26:5173",
    origin: process.env.FRONT_URL,
    // origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// to store rounds data in storage of server
const inMemoryGames = new Map();
// key: gameId, value: { currentRound, totalRounds, roundDuration, status, timerId, ... }

io.on("connection", (socket) => {
  console.log("Nouvelle connexion WS établie : ", socket.id);

  // -------------------------------------------------
  // Auto
  // -------------------------------------------------

  // -------------------------------------
  // -------------------------------------
  // ---------------- JOIN ROOM ----------
  // -------------------------------------
  // -------------------------------------
  // -------------------------------------
  socket.on("join-room", async (gameId, userId, role) => {
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

      console.log(
        `Socket ${socket.id} (user: ${user?.pseudo}) rejoint la room : ${gameId} avec le role : ${socket.role}`
      );

      if (role === "player") {
        // add socketId to user in database
        await Game.updateOne(
          { _id: gameId, "players.userId": userId },
          { $set: { "players.$.socketId": socket.id } }
        );

        const playerIndex = game.players.findIndex(
          (player) => player.userId === userId
        );
        if (playerIndex !== -1) {
          // game.players[playerIndex].socketId = socket.id;

          await Game.updateOne(
            { _id: gameId, "players.userId": userId },
            { $set: { "players.$.socketId": socket.id } }
          );
        }

        socket.broadcast.to(gameId).emit("player-joined", {
          userId: user.id,
          pseudo: user.pseudo,
          role: role,
          socketId: socketId,
        });
      } else if (role === "presentator") {
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

        socket.broadcast.to(gameId).emit("presentator-joined", {
          userId: userId, // can be null
          role: role,
        });
      }

      // send to all clients websocket instance in this room
      console.log(`emit to game ${gameId} : a new ${role} has joined the room`);

      // socket.broadcast.to(gameId).emit('player-joined', { socketId: socket.id, userId: user.id, pseudo: user.pseudo,  });
    } catch (error) {
      console.error("Error in join-room: ", error);
      socket.emit("error", {
        message: "Une erreur est survenue lors de la connexion à la room.",
      });
    }
  });

  // -------------------------------------
  // -------------------------------------
  // ---------------- IN GAME ------------
  // -------------------------------------
  // -------------------------------------

  socket.on("prepare-round-presentator", async ({ gameId, roundNumber }) => {
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
      io.to(gameId).emit("prepare-round", {
        roundNumber,
        roundData,
      });

      // initiliasize playersReady array to empty fot this round
      game.rounds[roundNumber].playersReady = [];
      await game.save();
    } catch (error) {
      console.error(
        `Error during round preparation for game ${gameId} at round ${roundNumber}`
      );

      socket.emit("error", {
        message: "Erreur lors de la préparation du round pour la partie : ",
        gameId,
      });
    }
  });

  socket.on("player-ready", async ({ gameId, userId, roundNumber }) => {
    try {
      const game = await Game.findById(gameId);

      // add player to array of players ready for this round
      if (!game.rounds[roundNumber].playersReady.includes(userId)) {
        game.rounds[roundNumber].playersReady.push(userId);

        await game.save();
      }

      // check if all players are ready
      // all players register in game are in players ready for this round
      const allPlayersReady = game.players.every((player) =>
        game.rounds[roundNumber].playersReady.includes(player.userId)
      );

      if (allPlayersReady) {
        // send event / notify presentator that all players are ready
        // const presentatorSocketId = game.presentator.socketId;

        // notify all users in room that all players are ready
        io.to(gameId).emit("all-players-ready", { roundNumber });
      }
    } catch (error) {
      console.error("Error in player ready / all players ready: ", error);
    }
  });

  socket.on("start-round", ({ gameId, roundNumber }) => {
    // notify players that the round as begin
    io.to(gameId).emit("start-round-players", { roundNumber });
  });

  socket.on("submit-answer", async ({ gameId, userId, roundNumber, choiceId }) => {
      try {
        // get game in database
        const game = await Game.findById(gameId);
        
        // get the timestamp of the beginning of the round 
        const gameState = inMemoryGames.get(gameId);
        const roundStart = gameState.roundStartTimeStamp;

        // to calculate duration interval between player response and beginning of round (to calculate score)
        const timeNow = Date.now();

        const responseTime = timeNow - roundStart;

        // calculate score
        const playerResponseIsCorrect = gameState.rounds[gameState.currentRound - 1].correctAnswer.toString() === choiceId;
        
        console.log(`is player response correct ${playerResponseIsCorrect}`);
        let scoreRound;
        if(!playerResponseIsCorrect) {
          scoreRound = 0;
        } else {
          scoreRound = getScoreFromResponseTime(responseTime);
        }
        console.log(`Score player : ${scoreRound}`);
        


          // TODO: add a check to see if player already responded  
          // TODO: add a check if player is responded to the currentRound and not another one
            // an intersting test case !!!
        game.rounds[roundNumber - 1].playersResponses.push({
          userId,
          userChoice: choiceId,
          responseTime: responseTime,
          score: scoreRound // caculate score here ???
        });

        // store response in round
        await game.save();
        
        // notify presentator
        io.to(game.presentator.socketId).emit("player-responsed", { userId });
        
        // notify socket player owner
        // send event to player who makes the response that his choice is stored
        socket.emit("answer-received", {success: true, responseTime: timeNow - roundStart});


      } catch (error) {
        console.error("Error in submit-answer:", error);
        socket.emit("error", {
          message: "Erreur lors de la soumission de la réponse.",
        });
      }

    }
  );

  socket.on("get-room-players", async (gameId) => {
    const game = await Game.findById(gameId);

    const players = game.players;

    // respond only to the socket who makes the event ????
    socket.emit("room-players-list", players);
  });

  // event submited only if role is set to presentator
  socket.on("launch-game", async (gameId) => {
    try {
    
      // return quickly if socket role is not set to presentator
    if (socket.role !== "presentator") {
      // error event

      // socket.emit('error');

      console.error(
        `Socket ${socket.id} tente une action (launch game) avec le mauvais role`
      );
      return;
    }



      // select game document
      const filter = { _id: gameId };

      // update status of game
      const update = {
        $set: { status: "in_progress" },
      };

      // update document to put status at 'in-progress'
      const updatedGame = await Game.findOneAndUpdate(filter, update, {
        projection: {},
        new: true,
      });


      // emit event to all users in this game
      // send socket id of presentator
      io.to(gameId).emit("move-in-game");


      // initialize automnation
      const foundGame = await Game.findById(gameId);
      if(!foundGame) {
        console.error(`Game not found while launching : ${gameId}`);
        return;
      }

      const totalRounds = foundGame.totalRounds || 5;
      const roundDuration = foundGame.roundDuration || 20;


      inMemoryGames.set(gameId, {
        currentRound: 0,
        totalRounds,
        roundDuration,
        status: 'NOT_STARTED',
        timerId : null,
        rounds: foundGame.rounds, // data foreach round,
        players: foundGame.players
      });



      // ---------------------------------------------
      // start automnation
      startGameAutomation(gameId);



    } catch (error) {
      // emit error event ??
      console.error(`Error in launch game socket event listener : `, error);
    }
  });


  function startGameAutomation(gameId) {
    const gameState = inMemoryGames.get(gameId);
    
    if(!gameState) return;

    console.log(`=== startGameAutomation === gameId : ${gameId}`);


    startNextRound(gameId);

  }

  function startNextRound(gameId) {
    const gameState = inMemoryGames.get(gameId);
    if(!gameState) return;


    gameState.currentRound++;
    if(gameState.currentRound > gameState.totalRounds) {
      // game is over
      endGame(gameId);
      return;
    }
  
  
    console.log(`=== startNextRound ===> Round ${gameState.currentRound} - gameId: ${gameId}`);

    gameState.status = 'ROUND_LOADING';

    // get extract url of extract of this round
    const extractUrl = getRoundExtractUrl(gameId, gameState.currentRound);


    io.in(gameId).emit('round-loading', {
      roundNumber: gameState.currentRound,
      totalRounds: gameState.totalRounds,
      extractUrl
    });

    // check correct event to start counter
    // clearTimeOut if game is deleted before his end


    // wait 3 seconds before emit event 'launch-round'
    const LOADING_DELAY = 3000;
    gameState.timerId = setTimeout(() => {
      console.log("round launched"),
      launchRound(gameId);
    }, LOADING_DELAY);
  
  }


  function launchRound(gameId) {
    const gameState = inMemoryGames.get(gameId);
    if(!gameState) return;

    console.log(`=== launch round ===> Round ${gameState.currentRound} - gameId: ${gameId}`);
    gameState.status = 'ROUND_IN_PROGRESS';

    // store timestamp of beginning of round
    gameState.roundStartTimeStamp = Date.now();

    // emit to everyone in the room this data
    io.in(gameId).emit('round-started', {
      roundNumber : gameState.currentRound,
      roundDuration : gameState.roundDuration,
      choices: gameState.rounds[gameState.currentRound - 1].choices
    });

    // timer / counter for end of round in server side
    gameState.timerId = setTimeout(async() => {
      await endRound(gameId);
    }, gameState.roundDuration * 1000); // ms to s

    
  }


  async function endRound(gameId) {
    const gameState = inMemoryGames.get(gameId);
    if(!gameState) return;

    const roundIndex = gameState.currentRound - 1;
    
    // get the round correct choice object of the current round
    const correctAnswerId = gameState.rounds[roundIndex].correctAnswer;
    const correctRoundChoice = gameState.rounds[roundIndex].choices.find(
      // ObjectId are compared by reference and not value in js
      // so it is compared after a toString on the objectId
      (choice) => choice.choiceId.toString() === correctAnswerId.toString()
    );



    console.log(`=== endRound ==> Round ${gameState.currentRound} - gameId: ${gameId}`);
    gameState.status = "ROUND_ENDED";


    // get correct answer of round


    // set 0 to players who dont have make a response to this round ???


    const game = await Game.findById(gameId);
    const playersResponses = game.rounds[roundIndex].playersResponses;

    // calculate scores of players
    const updatedPlayers = await calculateScores(game, roundIndex);




    // emit event round-results to broadcast results of round in presentator view
    io.in(gameId).emit('round-results', {
      roundNumber: gameState.currentRound,
      correctAnswer: correctRoundChoice,
      updatedPlayers
    });


    // wait 5 seconds before next round is being played
      // see if this data is store in gameData
    const RESULTS_DELAY = 7000;
    gameState.timerId = setTimeout(() => {
      startNextRound(gameId);
    }, RESULTS_DELAY);



  }


  function endGame(gameId) {
    console.log(`=== endGame ===> gameId : ${gameId}`);

    io.in(gameId).emit('game-ended', {message: 'La partie est terminée, merci d\'avoir joué !!'});

    // remove game from server storage
    inMemoryGames.delete(gameId);

  }


  function getRoundExtractUrl(gameId, roundNumber) {

    // get in storage the the url 
    const round = inMemoryGames.get(gameId).rounds[roundNumber - 1];

    const extract = round.audioPreviewUrl;

    return extract;

  }

  /**
   * 
   * @param {*} game mongodb game collection
   * @param {*} roundIndex index to target current round in rounds array
   * @returns {Array} - desc sorted list of players with their scores 
   */
  async function calculateScores(game, roundIndex) {
      
      // all players in the game
      const gamePlayers = game.players;
      
      // get all the responses made by the players in this round
      const roundResponses = game.rounds[roundIndex].playersResponses;

      // check for each player of the game if he has made a response in this round
      gamePlayers.forEach((player) => {
        const playerResponse = roundResponses.find(
          (response) => response.userId === player.userId
        );

        // a response is found for this player
        if(playerResponse) {

          // add to score of player the new score wether it's a correct or incorrect answer 
          player.score += playerResponse.score;

        } else {
          
          // if player has not made a response at this round, put a default score to 0 for keeping history
          roundResponses.push({
            userId: player.userId,
            score: 0
          });
          console.log(`${player.pseudo} has not make a response for this round`);

        }

      });        

      // store updated game in database
      await game.save();


      // sort locally scores
      game.players.sort((a, b) => b.score - a.score);


      return game.players;

  }


  function getScoreFromResponseTime(tMs) {
    const t = tMs / 1000; // convert ms to seconds
    const MAX_SCORE = 1000;
    const T = 20;
    const THRESHOLD = 1.2; // if under or equals this value -> it's max score

    //
    if(t <= THRESHOLD) {
      return MAX_SCORE;
    }

    // it's here but it should not be concerned
    if(t >= T) {
      return 0;
    }

    const slope = MAX_SCORE / (T - THRESHOLD);
    return Math.max(0, MAX_SCORE - slope * (t-THRESHOLD));
  }




  // socket.on("request-extracts", async ({ gameId }) => {
  //   console.log("in le request-extracts event", gameId);

  //   const gameExtracts = await Game.findById(gameId, {
  //     rounds: 1,
  //     totalRounds: 1,
  //   });

  //   socket.emit("receive-extracts", gameExtracts);
  // });

  // socket.on("load-to-player-round-data", async ({ gameId, currentRound }) => {
  //   const conditions = {};

  //   const projection = {};

  //   const currentRoundChoices = await Game.findOne(gameId);
  // });

  // socket.on('start-round', async (gameId, roundIndex) => {

  //   io.to(gameId).emit('start-round', { roundIndex });

  // });

  // socket.on("round-end", () => {
  //   // animate / update leaderboard and show updating scores
  //   //
  // });

  // socket.on("on-end-game", () => {
  //   //
  // });

  // -------------------------------------
  // -------------------------------------
  // ---------------- PLAYER-LEFT ----------
  // -------------------------------------
  // -------------------------------------
  socket.on("player-left", async (gameId, userId, socketId) => {
    console.log("player-left");
    console.log(gameId, userId);

    try {
      const filterPullPlayer = {
        _id: gameId,
      };

      console.log("la partie");
      console.log(filterPullPlayer);

      const updatePullPlayer = {
        $pull: {
          players: { userId: userId },
        },
      };

      const result = await Game.updateOne(filterPullPlayer, updatePullPlayer);

      console.log(result);

      if (result.modifiedCount > 0) {
        console.log(
          `Player ${userId} has been removed from the game ${gameId}`
        );

        // notify other users in room
        io.to(gameId).emit("update-players", { userId, action: "left" });
        // io.to(gameId).emit('player-left', userId);
      } else {
        console.log("no updates in game collection");
      }
    } catch (error) {
      console.error("Error in player-left : ", error);
    }
  });

  socket.on("presentator-left", async (gameId) => {
    try {
      const filterPullPresentator = {
        _id: gameId,
      };

      const updatePullPresentator = {
        $set: {
          presentator: null,
        },
      };

      const result = await Game.updateOne(
        filterPullPresentator,
        updatePullPresentator
      );

      console.log("before presentator result.modified");
      console.log(result);
      if (result.modifiedCount > 0) {
        console.log(`Presentator leaved game ${gameId}`);

        // notify other users in room
        io.to(gameId).emit("presentator-left", { action: "left" });
      }
    } catch (error) {
      console.error("Error in presentator-left : ", error);
    }
  });

  socket.on("delete-game", (gameId) => {
    // emit to all socket in room to quit game
    socket.broadcast.to(gameId).emit("quit-game", {
      message: "La partie a été supprimée, retour vers la page d'accueil.",
    });
  });

  socket.on("disconnect", () => {
    console.log(`Socket ${socket.id} s'est déconnectée`);
  });
});




server.on("error", errorHandler);
server.on("listening", () => {
  const address = server.address();
  console.log(address);
  const bind = typeof address === "string" ? "pipe " + address : "port " + port;
  console.log("Listening on " + bind);
});
server.listen(port, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${port}`);
});


const mongoose = require("mongoose");
const { MAX } = require("uuid");
const uri =
  "mongodb+srv://toquetclement:" +
  process.env.SECRET_MONGODB_ATLAS +
  "?retryWrites=true&w=majority&appName=musiquiz-rooms";
const clientOptions = {
  serverApi: { version: "1", strict: true, deprecationErrors: true },
};
async function run() {
  try {
    // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
    await mongoose.connect(uri, clientOptions);
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await mongoose.disconnect();
  }
}
run().catch(console.dir);
