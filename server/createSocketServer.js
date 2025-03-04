const { Server } = require("socket.io");

require("dotenv").config();

module.exports = (server, serverPort) => {
    // create websocket server
    const io = new Server(server, {
        cors: {
          origin: process.env.FRONT_URL,
          methods: ["GET", "POST"],
          credentials: true,
        },
      });
      
    // attach events to websocket server
    const socketHandlers = require("./socketHandlers");
    socketHandlers(io);

    return io;
}


