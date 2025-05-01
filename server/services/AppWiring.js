const io = require('../createSocketServer');
const InMemoryStore = require('../core/game/InMemoryStore');
const GameEngine = require('../core/game/GameEngine');
// const SocketGateway = require('../infra/websocket/SocketGateway');


const store = new InMemoryStore();
const engine = new GameEngine({ store });


// // hook / wire WS and engine events
// new SocketGateway(io, engine);


module.exports = { gameEngine: engine, store };