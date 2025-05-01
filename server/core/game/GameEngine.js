// the idea here is to habve 0 dependencies
// to be able to test easily



// EventEmitter : server is going to be abble to react to 'events'
// such as browser event like a click, a submit, ...
const EventEmitter = require('events');
const { getScoreFromResponseTime } = require('./ScoreCalculator');
const { roundsNumber } = require('../../services/GameManager');

const DEFAULT_LOADING_DELAY = 3000;
const DEFAULT_ROUND_LOADING_DELAY = 7000; 


class GameEngine extends EventEmitter {

    constructor( { store, roundLoadingDelay = DEFAULT_LOADING_DELAY } ) {
        super();
        this.store = store;
        this.LOADING_DELAY = roundLoadingDelay;
    }

    // preload of gameData in storage / store
    initGame(gameId, payload) {
        const state = {
            ...payload,
            currentRound: 0,
            status: 'waiting', // values available in mongoDB schema ['waiting', 'in_progress', 'finished', 'failed'], 
            // but here it's the Map so doesnt really matters
            timerId: null,
        };

        this.store.saveGame(gameId, state);
        this.emit('game-initialized', { gameId, totalRounds: payload.totalRounds });

    }

    // 
    startGame(gameId) {
        const state = this.store.getGame(gameId);
        if(!state) throw new Error('GameEngine: unknown game ' + gameId);

        state.status = 'in_progress'; // value available in mongoDB schema
        this.emit('game-started', { gameId });
        this.#startNextRound(gameId);

    }


    audioReady({ gameId, roundNumber }) {
        const state = this.store.getGame(gameId);
        if(!state || state.currentRound !== roundNumber) return;

        state.audioReadyReceived = true;

        setTimeout(() => {
            if(state.audioReadyReceived) this.#startRound(gameId);
        }, this.LOADING_DELAY);
    }



    //
    submitAnswer(gameId, userId, choiceId) {
        const state = this.store.getGame(gameId);
        if(!state) throw new Error(`submit answer: game ${gameId} not found`);

        const roundIndex = state.currentRound - 1;
        const responseTime = Date.now() - state.roundStartTimeStamp;
        const isCorrect = state.rounds[roundIndex].correctAnswer.toString() === choiceId;

        const score = isCorrect ? getScoreFromResponseTime(responseTime) : 0;
        this.emit('answer-submitted', { gameId, userId, score });
        return score;

    }



    

    // -------------------------------------------
    // ------------ private methods --------------
    // -------------------------------------------
    #startNextRound(gameId) {
        const state = this.store.getGame(gameId);
        state.currentRound += 1;
        

        if (state.currentRound > state.totalRounds) {
            console.log(`=== gameFinsihed ===> End of game - gameId: ${gameId}`);
            this.#endGame(gameId, state);
            return; // avoid to continue execution
        }
    
        state.audioReadyReceived = false;
    
        console.log(`=== startNextRound ===> Round ${state.currentRound} - gameId: ${gameId}`);


        this.emit('round-loading', {
          gameId,
          roundNumber: state.currentRound,
          totalRounds: state.totalRounds,
          extractUrl : state.rounds[state.currentRound - 1].audioPreviewUrl,
        });
      }

    #startRound(gameId) {
        const state = this.store.getGame(gameId);
        state.status = "ROUND_IN_PROGRESS";
        state.roundStartTimeStamp = Date.now();
        
        console.log(`=== beginningRound ==> Round ${state.currentRound} - gameId: ${gameId}`);


        this.emit('round-started', {
            gameId,
            roundNumber: state.currentRound,
            roundDuration: state.roundDuration,
            choices: state.rounds[state.currentRound - 1].choices
        });

        this.#scheduleEndOfRound(gameId);

    }

    #scheduleEndOfRound(gameId) {
        const state = this.store.getGame(gameId);
        clearTimeout(state.timerId); // if multiple calls

        // set the end of the round with a timer
        state.timerId = setTimeout(() => {
            this.#endRound(gameId)
        }, state.roundDuration * 1000);
    }

    async #endRound(gameId) {
        const state = this.store.getGame(gameId);
        if(!state) return;

        state.status = 'ROUND_ENDED';
        console.log(`=== endRound ==> Round ${state.currentRound} - gameId: ${gameId}`);

        const index = state.currentRound - 1;

        const correctAnswerId = state.rounds[index].correctAnswer.toString();

        // go in round to get data about the correct answer and not only his id
        const correctRoundChoice = state.rounds[index].choices.find(
            // ObjectId are compared by reference and not value in js
            // so it is compared after a toString on the objectId
            (choice) => choice.choiceId.toString() === correctAnswerId.toString()
        );


        // needs to handle calculation of score and
        // check if each player has made a response

        // ...


        this.emit('round-results', {
            gameId,
            roundNumber: state.currentRound,
            correctAnswer: correctRoundChoice,
            udpatedPlayers: state.players
        });


        clearTimeout(state.timerId);
        state.timerId = setTimeout(() => this.#startNextRound(gameId), this.DEFAULT_ROUND_LOADING_DELAY);

    }

    #endGame(gameId, state) {

        // clearTimeout(state.timerId);
        
        this.emit('game-ended', { 
            gameId,
            message: "La partie est terminée, merci d'avoir joué !",
            scores: state.players,
            roomName: state.roomName, // undefined
            tracks: this.#getGameTracks(state) 
        });
        return;
    }

    #getGameTracks(state) {
        return state.rounds.map(round => {
            const correctChoice = round.choices.find(choice => 
                choice.choiceId.toString() === round.correctAnswer.toString()
            );
            if(!correctChoice) throw new Error('Correct Choice is not found');
        
            return {
                artist: correctChoice.artistName,
                title: correctChoice.title,
                songExtract: round.audioPreviewUrl,
                correctAnswerId: correctChoice.choiceId,
                index: round.correctChoiceAnswer // undefined
            }
        })

    }



    async #calculateScores(state, roundIndex) {
        // all players in the game
        const gamePlayers = state.players;

        const roundResponses = state.rounds[roundIndex].playersResponses;


    } 



}

module.exports = GameEngine;