// link together GameEngine and Socket.io
// each GameEngine Event become a Websocket event

class SocketGateway {
    constructor(io, engine) {
        this.io = io;
    
    
        engine.on('game-initialized', payload => {
            io.to(payload.gameId).emit('game-initalized', payload);    
        });


        engine.on('game-started', payload => {
            io.to(payload.gameId).emit('game-started', payload);
        });

        engine.on('round-loading', payload => {
            io.to(payload.gameId).emit('round-loading', payload);
        });

        engine.on('answer-submited', ({ gameId, userId }) => {
            io.to(gameId).emit('player-answered', { userId });
        });

        










    }



}

module.exports = SocketGateway;