require("dotenv").config();
const http = require("http"); // va permetttre de créer un serveur
const app = require("./app");
const { error } = require("console");

const { Server } = require("socket.io");

const connectDB = require('./db/mongo');

connectDB();

const normalizePort = (val) => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};

// console.log("FRONT " + process.env.DOCKER_PORT_FRONT);
// console.log("SERVER API " + process.env.DOCKER_PORT_API);

const port = normalizePort(process.env.DOCKER_PORT_API); // get port from env variables
app.set("port", port); // set port of app server

/**
 * This function search for errors and handle some of it
 * @param {*} error
 */
const errorHandler = (error) => {
  console.log("In server.js error handler");
  if (error.syscall !== "listen") {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === "string" ? "pipe" + address : "port: " + port;

  switch (error.code) {
    case "EACCES":
      console.error(bind + "requires elevated privileges");
      process.exit(1);
      break;

    case "EADDRINUSE":
      console.error(bind + "is already in use.");
      process.exit(1);
      break;

    default:
      throw error;
  }
};



const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONT_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
});


const socketHandlers = require("./socketHandlers");
socketHandlers(io);


server.on("error", errorHandler);

server.on("listening", () => {
  const address = server.address();
  console.log(address);
  const bind = typeof address === "string" ? "pipe " + address : "port " + port;
  console.log("Listening on " + bind);
});
server.listen(port, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${port}`);
});



