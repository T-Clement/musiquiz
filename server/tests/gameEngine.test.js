const GameEngine = require('../core/game/GameEngine')
const InMemoryStore = require('../core/game/InMemoryStore');
const { MAX_SCORE } = require('../core/game/ScoreCalculator');

// to simulate timers
jest.useFakeTimers();


function roundTemplate() {
    return {
        audioPreviewUrl: 'audio-extract.mp3',
        correctAnswer: 'choice1',
        choices: [
            { choiceId: 'choice1' }, 
            { choiceId: 'choice2' }, 
            { choiceId: 'choice3' }, 
            { choiceId: 'choice4' }],
        playerResponses: []
    };
}

/**
 * Creates a fake GameEngine instance with a mocked MongoDB repository.
 * This allows testing the GameEngine without a database call needed
 * @returns {engine: GameEngine, store: InMemoryStore}
 */
function makeFakeEngine() {

    const fakeMongoRepo = {
        savePlayerResponse: jest.fn().mockResolvedValue(
            { presentator: { socketId: 'socket#123' } 
        }),
    };

    const store = new InMemoryStore();
    const engine = new GameEngine(
    {
        store, 
        roundLoadingDelay : 10, 
        defaultRoundLoadingDelay: 10,
        gameRepo: fakeMongoRepo
    });
    
    return { engine, store };
}


describe('GameEngine - submitAnswer & round cycle', () => {

    test("response is correct, maxscore + event answer-submitted", async () => {
        const { engine, store } = makeFakeEngine(); // create instance of GameEngine
        const events = [];

        const fakeUserId = "fakeUserId-1";
        const fakeGameId = 'fakegame-id';
        const fakePresentatorSocketId = 'socket#123';
        // add event to array to be able to react to it
        engine.on('answer-submitted', payload => events.push(payload));

        engine.initGame(fakeGameId, { // initialize game with fake data
            totalRounds: 1,
            roundDuration: 3,
            rounds: [roundTemplate()], // add data of one round
            players: [{ userId: fakeUserId }],
            presentator: { socketId: fakePresentatorSocketId }
        });

        engine.startGame(fakeGameId);
        engine.audioReady({ gameId: fakeGameId, roundNumber: 1 });

        // use to speed up time and simulate timer => go to round-started
        jest.advanceTimersByTime(10);

        // simulate player answering quickly - server get response time by looking at round start time
        const playerPointsAfterAnwsering = await engine.submitAnswer(fakeGameId, fakeUserId, 'choice1');

        expect(playerPointsAfterAnwsering).toBe(MAX_SCORE);
        expect(events).toHaveLength(1);
        // console.log(events);
        expect(events[0]).toMatchObject({ userId: fakeUserId, score: MAX_SCORE });
    });


})