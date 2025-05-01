// link together GameEngine and Socket.io
// each GameEngine Event become a Websocket event

class SocketGateway {
    constructor(io, engine) {
        this.io = io;
    
    
        engine.on('game-initialized', payload => {
            this.io.to(payload.gameId).emit('game-initialized', payload);    
        });


        engine.on('game-started', payload => {
            // adapter who allows to broadcast event to a subset of clients
            console.log(payload);
            const gameId = payload.gameId;
            const clients = this.io.sockets.adapter.rooms.get(gameId);
            if(clients) {
                clients.forEach(socketId => {
                    const socket = this.io.sockets.sockets.get(socketId);
                    socket.emit("game-started", { gameId, role: socket.role });
                    console.log("socket event game started: " + socket.role);
                });
            }

        });

        engine.on('round-loading', payload => {
            this.io.to(payload.gameId).emit('round-loading', payload);
        });

        engine.on('answer-submitted', ({ gameId, userId }) => {
            this.io.to(gameId).emit('player-answered', { userId });
        });

        










    }



}

module.exports = SocketGateway;