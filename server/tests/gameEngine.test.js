const GameEngine = require('../core/game/GameEngine')
const InMemoryStore = require('../core/game/InMemoryStore');
const { MAX_SCORE } = require('../core/game/ScoreCalculator');

// to simulate timers
jest.useFakeTimers();


function roundTemplate() {
    return [{
        audioPreviewUrl: 'audio-extract.mp3',
        correctAnswer: 'choice1',
        choices: [{ choiceId: 'choice1' }, { choiceId: 'choice2' }, { choiceId: 'choice3' }, { choiceId: 'choice4' }],
        playerResponses: []
    }];
}


function makeFakeEngine() {
    const store = new InMemoryStore();
    const engine = new GameEngine({store, roundLoadingDelay : 10, defaultRoundLoadingDelay: 10});
    
    return { engine, store };
}


describe('GameEngine - submitAnswer & round cycle', () => {

    test("response is correct, maxscore + event answer-submitted", () => {
        const { engine, store } = makeFakeEngine();
        const events = [];

        const fakeUserId = "fakeUserId-1";
        const fakeGameId = 'fakegame-id';

        // add event to array to be able to react to it
        engine.on('answer-submitted', payload => events.push(payload));


        engine.initGame(fakeGameId, {
            totalRounds: 1,
            roundDuration: 3,
            rounds: roundTemplate(),
            players: [{ userId: fakeUserId }]
        });

        engine.startGame(fakeGameId);
        engine.audioReady({ gameId: fakeGameId, roundNumber: 1 });

        // use to speed up time and simulate timer => go to round-started
        jest.advanceTimersByTime(10);


        const playerPointsAfterAnwsering = engine.submitAnswer(fakeGameId, fakeUserId, 'choice1');

        expect(playerPointsAfterAnwsering).toBe(MAX_SCORE);
        expect(events).toHaveLength(1);
        expect(events[0]).toMatchObject({ userId: fakeUserId, score: MAX_SCORE });


    })


})