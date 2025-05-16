const io = require('../createSocketServer');
const InMemoryStore = require('../core/game/InMemoryStore');
const GameEngine = require('../core/game/GameEngine');
// const SocketGateway = require('../infra/websocket/SocketGateway');

const GameRepo = require('../infra/repositories/GameRepository');
const SqlRepo = require('../infra/repositories/SqlGameRepository');


const store = new InMemoryStore();
const gameRepo = new GameRepo();
const sqlRepo = new SqlRepo();

// initialize engine and make dependencies injection
const engine = new GameEngine({ store, gameRepo, sqlRepo });


// hook / wire WS and engine events
// new SocketGateway(io, engine);

// Dependency Injection and Repository Pattern
https://psid23.medium.com/dependency-injection-and-the-repository-design-pattern-7664df76fb93


module.exports = { gameEngine: engine, store };