const io = require('../createSocketServer');
const InMemoryStore = require('../core/game/InMemoryStore');
const GameEngine = require('../core/game/GameEngine');
// const SocketGateway = require('../infra/websocket/SocketGateway');


const store = new InMemoryStore();
const engine = new GameEngine({ store });


// // hook / wire WS and engine events
// new SocketGateway(io, engine);

// Dependency Injection and Repository Pattern
https://psid23.medium.com/dependency-injection-and-the-repository-design-pattern-7664df76fb93


module.exports = { gameEngine: engine, store };