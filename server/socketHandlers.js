const Game = require("./schema/Game");
const User = require("./models/User");
const GameManager = require("./services/GameManager");
const { gameEngine } = require('./services/AppWiring');
const SocketGateway = require("./infra/websocket/SocketGateway");

const invalidate = require('./infra/cache/cacheInvalidator');

module.exports = (io) => {

  new SocketGateway(io, gameEngine);

  // second game-ended listener to handle here cache invalidation
  // when a game as ended
  gameEngine.on('game-ended', async ( payload ) => {
    try {
      // invalidate scores related to the room
      await invalidate(`_musiquiz.room.show[id-${payload.roomId}]_`);

      // invalidate top3
      await invalidate(`_musiquiz.top3_`);

      // invalidate theme caches when theme data becomes available
      await invalidate(`_musiquiz.theme.show[id-${payload.themeId}]_`);
      
    } catch (error) {
      console.error(`Failed to invalidate caches for game ${payload.gameId}:`, error);
    }
  });



  io.on("connection", (socket) => {
    console.log("Nouvelle connexion WS : ", socket.id);

    socket.on("join-room", async (gameId, userId, role) => {
      console.log("In event == 'join-room' ==");

      const socketId = socket.id;

      try {
        const user = await User.getUserForGame(userId); // SQL Object

        // add user to the Map of ingame players / users
        GameManager.addUserToInGamePlayersMemory(userId, gameId);
        
        const game = await Game.findById(gameId); // Mongoose Schema

        if (!game) {
          console.error(`Game not found : ${gameId}`);
          return;
        }

        // add role to socket
        socket.role = role;

        // associate websocket to game room / channel
        socket.join(gameId);

        console.log(
          `Socket ${socketId} (user: ${user?.pseudo}) rejoint la room : ${gameId} avec le role : ${socket.role}`
        );

        if (role === "player") {
          // add socketId to user in database

          const playerIndex = game.players.findIndex(
            (player) => player.userId === userId
          );

          // add player in game if player is not
          // already in list of players of this game
          if (playerIndex !== -1) {
            await Game.updateOne(
              { _id: gameId, "players.userId": userId },
              { $set: { "players.$.socketId": socketId } }
            );
          }

          // broadcast to all socket in the room
          socket.broadcast.to(gameId).emit("player-joined", {
            userId: user.id,
            pseudo: user.pseudo,
            role: role,
            socketId: socketId,
          });
        } else if (role === "presentator") {
          // set presentator in MongoDB document
          await Game.updateOne(
            { _id: gameId },
            { $set: { presentator: { userId, socketId: socket.id } } }
          );

          socket.broadcast.to(gameId).emit("presentator-joined", {
            userId: userId, // can be null
            role: role,
          });
        }


        // send to all clients websocket instance in this room ??
        console.log(`emit to game ${gameId} : a new ${role} has joined the room`);

      } catch (error) {
        console.error("Error in join-room: ", error);
        socket.emit("error", {
          message: "Une erreur est survenue lors de la connexion à la room.",
        });
      }
    });



    // remove from database and in memory
    socket.on("player-left", async (gameId, userId, socketId) => {
        console.log("player-left");
        console.log(gameId, userId);


        try {

            GameManager.removeOnePlayerFromInGameMemory(userId);

            const updatePullPlayer = {
                $pull: {
                    players: { userId: userId }
                }
            };

            // request to update the list of players by pulling out
            // user associate with this socket
            const result = await Game.updateOne(
                { _id: gameId }, // game Document to target
                updatePullPlayer
            );

            if( result.modifiedCount > 0 ) {
                console.log(
                    `Player ${userId} has been removed from the game ${gameId}`
                );

            // notifiy other users in room
            io.to(gameId).emit("update-players", {
                userId, action: "left"
            });


            } else {
                console.error("Error Player-left : No updates in game " + gameId);
            }

        } catch(error) {
            console.error("Error in player-left : ", error);
        }

    });


    socket.on("presentator-left", async (gameId, userId) => {
        try {
            
            if(userId) {
                // remove user from in memory players
                GameManager.removeOnePlayerFromInGameMemory(userId);
            }

            const updatePullPresentator = {
                $set: {
                    presentator: null,
                },
            };


            const result = await Game.updateOne(
                { _id: gameId }, updatePullPresentator
            );


            if(result.modifiedCount > 0) {
                console.log(`Presentator leaved game ${gameId}`);

                // notify others users in room
                io.to(gameId).emit("presentator-left", { action: "left" });


            }
        } catch (error) {
            console.error("Error in presentator-left : ", error);
        }
    });


    socket.on("delete-game", (gameId) => {
        // emit to all socket in room to quit game
        socket.broadcast.to(gameId).emit("quit-game", {
            message: "La partie a été supprimée, retour vers la page d'accueil"
        });
    });



    socket.on("ping", () => {
      console.log('socketHandlers : ping')
      socket.emit("pong", { message : 'pong' });
    })
    
    // --------------------------------------
    // --------------------------------------
    // IN-GAME RELATED HANDLERS
    // --------------------------------------
    // --------------------------------------
    socket.on("get-room-players", async (gameId) => {
      const game = await Game.findById(gameId);
      
      const players = game.players;
      
      console.log("get-room-players event", players);
      // respond only to the socket who makes the event ????
      socket.emit("room-players-list", players);
    });

    socket.on("launch-game", async (gameId) => {
      try {

        // TODO : early return if role is not fired by the presentator
        if(socket.role !== "presentator") {
            console.error(        
                `Socket ${socket.id} tente une action (launch game) avec le mauvais role`
            );
            return;
        }

        const foundGame = await Game.findById(gameId);
        if (!foundGame) {
          console.error(`Game not found : ${gameId}`);
          return;
        }

        // gameManager.initGame(gameId, {
        //   totalRounds: foundGame.totalRounds,
        //   roundDuration: foundGame.roundDuration,
        //   rounds: foundGame.rounds,
        //   players: foundGame.players,
        //   timerId: null,
        //   // status: 'NOT'
        // });

        gameEngine.initGame(gameId, {
          totalRounds: foundGame.totalRounds,
          roundDuration: foundGame.roundDuration,
          rounds: foundGame.rounds,
          players: foundGame.players
        });


        foundGame.status = "in_progress";
        await foundGame.save();

        // emit envent to all users in this game
        io.to(gameId).emit("move-in-game");


        // gameManager.startGame(gameId);
        gameEngine.startGame(gameId);


      } catch (error) {
        console.error(`Error in launch-game :`, error);
      }
    });



    socket.on("submit-answer", async ({ gameId, userId, choiceId }) => {
      try {

        // await gameManager.submitAnswer(gameId, userId, choiceId);
        gameEngine.submitAnswer(gameId, userId, choiceId);

        socket.emit("answer-received", { success: true });

      } catch (error) {
        console.error("Error in submit-answer :", error);
        socket.emit("error", {
            message: "Erreur lors de la soumission de la réponse.",
        });
      }
    });


    socket.on("audio-ready", ({ gameId, roundNumber }) => {
      gameEngine.audioReady({ gameId, roundNumber });
    });





    socket.on("disconnect", () => {

      // GameManager.inMemoryPlayersInGames.delete(userId);
        console.log(`Socket ${socket.id} s'est déconnectée`);
    });


  });
};
