// the idea here is to habve 0 dependencies
// to be able to test easily

const EventEmitter = require('events');
const { getScoreFromResponseTime } = require('./ScoreCalculator');

// EventEmitter : server is going to be abble to react to 'events'
// such as browser event like a click, a submit, ...

class GameEngine extends EventEmitter {

    constructor( { store } ) {
        super();
        this.store = store;
    }

    // preload of gameData in storage / store
    initGame(gameId, payload) {
        const state = {
            ...payload,
            currentRound: 0,
            status: 'waiting', // values available in mongoDB schema ['waiting', 'in_progress', 'finished', 'failed']
            timerId: null
        };

        this.store.saveGame(gameId, state);
        this.emit('game-initialized', { gameId, totalRounds: payload.totalRounds });

    }

    // 
    startGame(gameId) {
        const state = this.store.getGame(gameId);
        if(!state) throw new Error('GameEngine: unknown game ' + gameId);

        state.status = 'in_progress'; // value available in mongoDB schema
        this.emit('game-started', {gameId});
        this.#startNextRound(gameId);

    }

    //
    submitAnswer(gameId, userId, choiceId) {
        const state = this.store.getGame(gameId);
        if(!state) throw new Error(`submit answer: game ${gameId} not found`);

        const roundIndex = state.currentRound - 1;
        const responseTime = Date.now() - state.roundStartTimeStamp;
        const isCorrect = state.rounds[roundIndex].correctAnswer.toString() === choiceId;

        const score = isCorrect ? getScoreFromResponseTime(responseTime) : 0;
        this.emit('answer-submited', { gameId, userId, score });
        return score;

    }



    


    // ------------ private methods --------------
    #startNextRound(gameId) {
        const state = this.store.getGame(gameId);
        state.currentRound += 1;
    
        if (state.currentRound > state.totalRounds) {
          this.emit('game-finished', { gameId });
          return;
        }
    
        state.audioReadyReceived = false;
    
        this.emit('round-loading', {
          gameId,
          roundNumber: state.currentRound,
          totalRounds: state.totalRounds,
          extractUrl : state.rounds[state.currentRound - 1].audioPreviewUrl,
        });
      }



}

module.exports = GameEngine;