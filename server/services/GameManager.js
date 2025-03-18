const Game = require("../schema/Game");

class GameManager {
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Private_properties

    static inMemoryGames = new Map();
    static inMemoryPlayersInGames = new Map();

    static roundsNumber = 2;
    static numberOfResponsePropositions = 4;

    static addUserToInGamePlayersMemory(userId, gameId) {
        GameManager.inMemoryPlayersInGames.set(userId, gameId);
    }


    static checkIfUserIsAlreadyInOneGame (userId) {                
        return GameManager.inMemoryPlayersInGames.get(userId) ?? false;
    }

    static removeOnePlayerFromInGameMemory (userId) {
        console.log(`remove player with id : ${userId}`);
        GameManager.inMemoryPlayersInGames.delete(userId);
    }



    static removePlayersFromInGamePlayers(gameId) {

        // console.log(GameManager.inMemoryPlayersInGames.entries());

        // to put in a function 
        // remove from memory all users who are in this game who is ended
        for(let [key, value] of GameManager.inMemoryPlayersInGames.entries()) { // get all games who are running
            if(value === gameId) {
                console.log(`user ${key} deleted from game ${value}`)
                GameManager.inMemoryPlayersInGames.delete(key); // key is the userId
            }
        }
    }



    // put delay between rounds as a static property
    // put delay before to launch round after audio extract for round
        // is loaded in presentator view
    
    /**
     * 
     * @param {Server} io - this is the Socket.io server 
    */
   constructor(io) {
       this.io = io;
    //    this.inMemoryGames = new Map();
    }




    initGame(gameId, gameData) {
        const gameState = GameManager.inMemoryGames.get(gameId);

        // gameState.set(gameId, {
        //     currentRound: 0,
        //     totalRounds: gameData.totalRounds,
        //     roundDuration: gameData.roundDuration,
        //     rounds: gameData.rounds,
        //     status: 'NOT_STARTED',
        //     timerId: null,
        //     players: gameData.players,
        // });


        Object.assign(gameState, {
            currentRound: 0,
            totalRounds: gameData.totalRounds,
            roundDuration: gameData.roundDuration,
            rounds: gameData.rounds,
            status: "NOT_STARTED",
            timerId: null,
            players: gameData.players,
        });


        this.io.to(gameId).emit("game-initialized", {
            gameId,
            totalRounds: gameData.totalRounds
        });

    }


    startGame(gameId) {
        const gameState = GameManager.inMemoryGames.get(gameId);
        if(!gameState) {
            console.error(`startGame: Game not found : ${gameId}`);
            return;
        }

        console.log(`=== startGameAutomation === gameId : ${gameId}`);

        gameState.status = "STARTED";

        // adapter allow to broadcast event tu a subset of clients
        const clients = this.io.sockets.adapter.rooms.get(gameId);
        if(clients) {
            clients.forEach(socketId => {
                const socket = this.io.sockets.sockets.get(socketId);
                socket.emit("game-started", {gameId, role: socket.role});
                console.log("socket event game started : " + socket.role);
            })
        }


        // this.io.to(gameId).emit("game-started", { gameId });


        this.#_startNextRound(gameId);


    }

    // private method
    #_startNextRound(gameId) {
        const gameState = GameManager.inMemoryGames.get(gameId);
        if(!gameState) return;


        gameState.currentRound++;
        if(gameState.currentRound > gameState.totalRounds) {
            // it means that the game is over
            return this._endGame(gameId);

        }

        // flag for readiness of audio in presentator client
        gameState.audioReady = false;


        
        console.log(`=== startNextRound ===> Round ${gameState.currentRound} - gameId: ${gameId}`);
        
        gameState.status = "ROUND-LOADING";
        
        const roundExtractUrl = this._getRoundExctractUrl(gameId, gameState.currentRound);

        // emit data to everybody in room
        this.io.in(gameId).emit("round-loading", {
            roundNumber: gameState.currentRound,
            totalRounds: gameState.totalRounds,
            extractUrl : roundExtractUrl
        });



        // // 3s delay between rounds 
        // const LOADING_DELAY = 3000;
        // gameState.timerId = setTimeout(() => {
            //     console.log("round launched");
            //     this._launchRound(gameId);
            // }, LOADING_DELAY);
            
            
        }
        
        
        
    _launchRound(gameId) {
        const gameState = GameManager.inMemoryGames.get(gameId);
        if(!gameState) return;
        console.log(gameState.players);

        console.log(`=== launch round ===> Round ${gameState.currentRound} - gameId: ${gameId}`);

        gameState.status = "ROUND_IN_PROGRESS";


        gameState.roundStartTimeStamp = Date.now();



        this.io.in(gameId).emit("round-started", {
            roundNumber: gameState.currentRound,
            roundDuration: gameState.roundDuration,
            choices: gameState.rounds[gameState.currentRound - 1].choices,
        });



        gameState.timerId = setTimeout(() => {
            this._endRound(gameId);
        }, gameState.roundDuration * 1000);

    }
    
    
    async _endRound(gameId) {
        const gameState = GameManager.inMemoryGames.get(gameId);
        if(!gameState) return;
        
        gameState.status = "ROUND_ENDED";
        const roundIndex = gameState.currentRound - 1;
        
        // calculate scores
        
        // const updatedPlayers ...
        
        
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
        // const playersResponses = game.rounds[roundIndex].playersResponses;
        
        // calculate scores of players
        const updatedPlayers = await this._calculateScores(game, roundIndex);
        
        // update the object in memory
        gameState.players = updatedPlayers;
        
        
        // emit event round-results to broadcast results of round in presentator view
        this.io.in(gameId).emit('round-results', {
            roundNumber: gameState.currentRound,
            correctAnswer: correctRoundChoice,
            updatedPlayers
        });
        
        
        // wait 5 seconds before next round is being played
        // see if this data is store in gameData
        const RESULTS_DELAY = 7000;
        gameState.timerId = setTimeout(() => {
            this.#_startNextRound(gameId);
        }, RESULTS_DELAY);
        
        
        
        
        
        
        // this.io.to(gameId).emit("round-ended", {
            //     roundNumber: gameState.currentRound,
            //     // correctAnswer,
            //     // updatedPlayers
            // });
            
            
            
            // // delay between each rounds
            // setTimeout(() => {
                //     this._startNextRound(gameId);
                // }, 5000);
                
                
    }
            
            
            
    _endGame(gameId) {

        // scores 
        const gameState = GameManager.inMemoryGames.get(gameId);
        const scores = gameState.players;

        // delete game from memory
        GameManager.inMemoryGames.delete(gameId);
        
        // remove all the players in a game
        GameManager.removePlayersFromInGamePlayers(gameId);

        // GameManager.inMemoryPlayersInGames.delete()
        console.log(`P=== endGame ===> End of game ${gameId}`);
        console.log(scores);

        // ??? this.io.in or this.io.to ???
        this.io.in(gameId).emit("game-ended", {
            message: "La partie est terminée, merci d'avoir joué !",
            gameId,
            scores,
            roomName: gameState.roomName,
            tracks : GameManager.getGameExtracts(gameState) // filter this to return only the correct answer
        })
    }


    static getGameState(gameId) {
        return this.inMemoryGames.get(gameId);
    }

    static killGameInstance(gameId) {
        const gameState = GameManager.inMemoryGames.get(gameId);
        if(!gameState) return; // nothing to kill
        if(gameState.timerId) {
            clearTimeout(gameState.timerId);
        }
        this.inMemoryGames.delete(gameId);

        GameManager.removePlayersFromInGamePlayers(gameId);
    }


    async submitAnswer(gameId, userId, choiceId) {

        const gameState = GameManager.inMemoryGames.get(gameId);
        if(!gameState) throw new Error("Game not found in memory : " + gameId);


        const roundIndex = gameState.currentRound - 1;
        // const gameDocument = await Game.findById(gameId);
        // if(!gameDocument) throw new Error("Game not found in DB");

        // ----
        const roundStart = gameState.roundStartTimeStamp;
        const responseTime = Date.now() - roundStart;
        const isCorrect = gameState.rounds[roundIndex].correctAnswer.toString() === choiceId;

        
        // 0 if false, else calculate score with related method
        const scoreRound = isCorrect ? this._getScoreFromResponseTime(responseTime) : 0;
        console.log(`User ${userId} // response : ${isCorrect} // scoreRound : ${scoreRound}`);

        // gameDocument.rounds[roundIndex].playersResponses.push({
        //     userId,
        //     userChoice: choiceId,
        //     responseTime,
        //     score: scoreRound
        // });

        // await gameDocument.save(); // care about version control / concurency -> update issue if 2 players submit a response closely in time

        // version error if using .findById -> Mongo compares version of Document
        // and throw version error if the document send by .save() has not the same version 
        // as this one document in database
        const udpatedGame = await Game.findOneAndUpdate(
            {_id: gameId},
            {
                $push: { [`rounds.${roundIndex}.playersResponses`] : { // rounds.${roundIndex} to get access to a sub-array
                    userId,
                    userChoice: choiceId,
                    responseTime,
                    score: scoreRound
                }
            }
            },
            { new: true } // returns new version of Document
        )

        // notify presentator that a player has submited an answer
        this.io.to(udpatedGame.presentator.socketId).emit("player-responded", { userId });

    }









    
    // method to calculate scores
    // ....
    


    _getRoundExctractUrl(gameId, roundNumber) {

        const round = GameManager.inMemoryGames.get(gameId).rounds[roundNumber - 1];

        const extract = round.audioPreviewUrl;

        return extract;

    }



    _/**
   * 
   * @param {*} game mongodb game collection
   * @param {*} roundIndex index to target current round in rounds array
   * @returns {Array} - desc sorted list of players with their scores 
   */
  async _calculateScores(game, roundIndex) {
      
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




    _getScoreFromResponseTime(tMs) {
        const t = tMs / 1000; // convert ms to seconds
        const MAX_SCORE = 1000;
        const T = 20;
        const THRESHOLD = 1.2; // if under or equals this value -> it's max score

        // user responded in a very short time, so he gets max point
        if(t <= THRESHOLD) {
            return MAX_SCORE;
          }
      
        // it's here but it should not be concerned
        if(t >= T) {
        return 0;
        }
    
        const slope = MAX_SCORE / (T - THRESHOLD);
        return Math.floor(Math.max( 0, MAX_SCORE - slope * (t - THRESHOLD) ));

    }



    static getGameExtracts(gameData) {
        return gameData.rounds.map(round => {
            const correctChoice = round.choices.find(choice => 
                choice.choiceId.toString() === round.correctAnswer.toString()
            );

            if(!correctChoice) {
                throw new Error('Correct Choice is not found');
            }

            return {
                artist: correctChoice.artistName,
                title: correctChoice.title,
                songExtract: round.audioPreviewUrl,
                correctAnswerId: correctChoice.choiceId,
                index: round.correctChoiceAnswer
              }
        })
    }



    
}



module.exports = GameManager;


// SINGLETON where we export an instance of the class
// who is the same on that is used in all application
// module.exports = new GameManager();