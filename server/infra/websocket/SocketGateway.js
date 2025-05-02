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

        engine.on('game-ended', payload => {
            // console.log('event émis !', payload),
            this.io.to(payload.gameId).emit('game-ended', payload);
        });

        engine.on('round-loading', payload => {
            this.io.to(payload.gameId).emit('round-loading', payload);
        });

        engine.on('round-started', payload => {
            this.io.to(payload.gameId).emit('round-started', payload);
        });

        engine.on('round-results', payload => {
            this.io.to(payload.gameId).emit('round-results', payload);
        });


        engine.on('answer-submitted', ({ gameId, userId }) => {
            this.io.to(gameId).emit('player-answered', { userId });
        });


        engine.on('disconnect-players-from-room', gameId => {
            // remove all users from socket room and delete room as their is no more socket in it
            this.io.socketsLeave(gameId); 
        });

        










    }



}

module.exports = SocketGateway;