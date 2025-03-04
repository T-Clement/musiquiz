const mongoose = require("mongoose");
const pool = require("../db/index");
const fs = require("fs");

const request = require("supertest");
const app = require("../app");
const User = require("../models/User");

const InputValidationMessage = require("../models/InputValidationMessage");

const dumpFilePath = "./tests/test-setup.sql";

let mysqlConnection;

const utils = require('../utils/utils');




require("dotenv").config();

// /* connecting to the database before each test. */
beforeEach(async () => {
  // await mongoose.connect(process.env.MONGODB_URI);
  // console.log("BEFORE EACH : Setting up test database");

  // create connection
  mysqlConnection = await pool.getConnection();
  // start a transaction
  await mysqlConnection.beginTransaction();

  // import SQL dump
  const dumpContent = fs.readFileSync(dumpFilePath, "utf-8");

  try {
    await mysqlConnection.query(dumpContent);
    // console.log("BEFORE EACH : Dump imported successfully");
  } catch (error) {
    console.error(
      "BEFORE EACH : Error during importing dump : ",
      error.message
    );
    throw error;
  }
});

// /* closing database connection after each test. */
afterEach(async () => {
  // await mongoose.connection.close();
  // console.log("AFTER EACH : Rolling back transaction...");
  await mysqlConnection.rollback();
  await mysqlConnection.release();
  // console.log("AFTER EACH : Connection released");
});

afterAll(async () => {
  await pool.end();
  console.log("AFTER ALL : Database connection pool closed.");
});

// each test use the database connection

describe("GET /api/ping", () => {
  it("Healtcheck of api, should return a 'pong' response", async () => {
    const res = await request(app).get("/api/ping");
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("pong");
  });
});

describe("POST /api/user/register", () => {
  it("should register a new user in database", async () => {
    const newUser = new User(
      null,
      "PseudoTest",
      "password",
      "test@example.com",
      Date.now,
      Date.now
    );

    const res = await request(app)
      .post("/api/user/register") // api route
      .send(newUser) // payload data
      .set("Content-Type", "application/json")
      .set("Accept", "application/json");
    
      expect(res.statusCode).toBe(201);
  });


  it("should not register : user with this email already exists in database", async () => {
    
    const email = "test@example.com";

    const userPassword = "password";
    
    const saltRounds = 10;
    const hashedPassword = await utils.generatePasswordHash(userPassword, saltRounds);
    

    // -----
    // create new User 
    const newUser = new User(
      null,
      "PseudoTest",
      hashedPassword,
      email,
      Date.now,
      Date.now
    );
    
    // insert new user DIRECTLY IN DATABASE
    await User.insertNewUser(newUser.pseudo, newUser.password, newUser.email);


    // --------------------
    // create new user with the same email as the previous one
    const newUserWithSameEmail = new User(
      null,
      "UserNotRegistered",
      hashedPassword,
      email,
      Date.now,
      Date.now
    );


    // send data to the post route /api/user/register
    return request(app)
      .post("/api/user/register") // api route
      .send(newUserWithSameEmail) // payload data
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .expect(400)
      .then(response => {
        expect(response.body.message = User.errorsMessages.emailAlreadyExists); // error messages in User Model
      });
  });

  it("should not register : user with this pseudo already exists in database", async () => {

       
    const pseudo = "TestPseudo";

    const userPassword = "password";
    
    const saltRounds = 10;
    const hashedPassword = await utils.generatePasswordHash(userPassword, saltRounds);
    

    // -----
    // create new User 
    const newUser = new User(
      null,
      pseudo,
      hashedPassword,
      "test@example.com",
      Date.now,
      Date.now
    );
    
    // insert new user DIRECTLY IN DATABASE
    await User.insertNewUser(newUser.pseudo, newUser.password, newUser.email);


    // --------------------
    // create new user with the same pseudo as the previous one
    const newUserWithSamePseudo = new User(
      null,
      pseudo,
      hashedPassword,
      "example@test.com",
      Date.now,
      Date.now
    );


    // send data to the post route /api/user/register
    return request(app)
      .post("/api/user/register") // api route
      .send(newUserWithSamePseudo) // payload data
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .expect(400)
      .then(response => {
        expect(response.body.message = User.errorsMessages.pseudoAlreadyExists); // error messages in User Model
      });



  });

});



const testCases = [
  {
    name: "missing pseudo",
    payload: { email: "test@example.com", password:  "password"},
    field: "pseudo",
    expectedMessage : InputValidationMessage.MISSING_PSEUDO
  },
  {
    name: "pseudo to short",
    payload: { pseudo: "ab", email: "test@example.com", password: "validpassword" },
    field: "pseudo",
    expectedMessage: InputValidationMessage.PSEUDO_TO_SHORT
  },  
  {
    name: "missing email",
    payload: { pseudo: "TestPseudo", password: "password" },
    field: "email",
    expectedMessage: InputValidationMessage.MISSING_EMAIL
  },
  {
    name: "invalid email",
    payload: { pseudo: "ValidPseudo", email: "emailnotvalid.com", password: "validpassword" },
    field: "email",
    expectedMessage: InputValidationMessage.NOT_VALID_EMAIL
  },
  {
    name: "missing password",
    payload: { pseudo: "ValidPseudo", email: "test@example.com" },
    field: "password",
    expectedMessage: InputValidationMessage.MISSING_PASSWORD
  },
  {
    name: "password too short",
    payload: { pseudo: "ValidPseudo", email: "test@example.com", password: "short" },
    field: "password",
    expectedMessage: InputValidationMessage.PASSWORD_TO_SHORT
  }
];

describe("POST /api/user/register - inputs fields validation", () => {
  // test foreach test of testCases array
  it.each(testCases)("should return error when $name", async ({ payload, field, expectedMessage }) => {
    const res = await request(app)
      .post("/api/user/register")
      .send(payload)
      .set("Content-Type", "application/json")
      .set("Accept", "application/json");

      // console.log(res)
    expect(res.statusCode).toBe(400);
    expect(res.body.errors).toBeDefined();

    // structure of express validator error object : 
    // [
    //   {
    //     type: 'field',
    //     value: 'short',
    //     msg: 'Le mot de passe doit faire plus de 8 caractères',
    //     path: 'password',
    //     location: 'body'
    //   }
    // ]

    // search for the tested error in response
    // const error = res.body.errors.find(err => err.path === field); 
    const errors = res.body.errors;
    expect(errors).toBeDefined();
    expect(errors[field]).toEqual(expectedMessage);
  });

});



describe("POST /api/login", () => {

});


describe("WS tests", () => {

  // DOCUMENTATION
  // https://stackoverflow.com/questions/15509231/unit-testing-node-js-and-websockets-socket-io?rq=4


  let testHttpServer, socketServer, clientSocket;
  const http = require("http"); // va permetttre de créer un serveur
  const port = 44444;
  const hostname = "localhost";
  const ioc = require("socket.io-client");
  const socketServerUrl = `http://${hostname}:${port}`;

  // before((done) => {
  //   const httpServer = createServer();
  //   io = new Server(httpServer);
  //   httpServer.listen(() => {
  //     const port = httpServer.address().port;
  //     clientSocket = ioc(`http://localhost:${port}`);
  //     io.on("connection", (socket) => {
  //       serverSocket = socket;
  //     });
  //     clientSocket.on("connect", done);
  //   });
  // });

  // after(() => {
  //   io.close();
  //   clientSocket.disconnect();
  // });

  beforeAll((done) => {

    
    
    app.set("port", port);
    
    // HTTP server needed to hook websocket on it
    testHttpServer = http.createServer(app);
    const createTestSocketServer = require('../createSocketServer');
    socketServer = createTestSocketServer(testHttpServer, port);

    testHttpServer.listen(port, 'localhost', () => {
      console.log(`Testing server is running on ${hostname}:${port}`);
    });


    // server express doit tourner, pour que le socket s'attache dessus
    clientSocket = ioc(socketServerUrl); // 
    clientSocket.on("connect", done);

  });

  afterAll((done) => {
    clientSocket.disconnect(); // disconnect client instance
    socketServer.close(); // close socket server
    
    // close http server
    testHttpServer.close();

    done();

  });

  // PENSER A NETTOYER les sockets
  // + stocker en mémoire
  // vérifier si joueur / socket n'est pas déjà dans une partie -> map en mémoire 
  // et vérification via middleware si trouvé : message d'erreur
  
  // autorisation

  // placer les infos du JWT dans la socket 
  // https://socket.io/how-to/use-with-jwt


  // -----------------------------------------
  it("client websocket should connect to websocket server, perform ping-pong", (done) => {

    // create new socket client instance
    const newSocketClient = ioc(socketServerUrl);

    // 'event' listener before emit, to avoid sending message before listener is up
    newSocketClient.on("pong", (data) => {
      console.log("in on 'ping'")
      console.log(data.message);
      expect(data.message).toBe("pong");
      newSocketClient.disconnect();
      done();
    });

    newSocketClient.emit('ping');

  });

});
