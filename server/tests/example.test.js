const mongoose = require("mongoose");
const pool = require("../db/index");
const fs = require("fs");

const request = require("supertest");
const app = require("../app");
const User = require("../models/User");

const dumpFilePath = "./tests/test-setup.sql";

let mysqlConnection;

const utils = require('../utils/utils');




require("dotenv").config();

// /* connecting to the database before each test. */
beforeEach(async () => {
  // await mongoose.connect(process.env.MONGODB_URI);
  console.log("BEFORE EACH : Setting up test database");

  // create connection
  mysqlConnection = await pool.getConnection();
  // start a transaction
  await mysqlConnection.beginTransaction();

  // import SQL dump
  const dumpContent = fs.readFileSync(dumpFilePath, "utf-8");

  try {
    await mysqlConnection.query(dumpContent);
    console.log("BEFORE EACH : Dump imported successfully");
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
  console.log("AFTER EACH : Rolling back transaction...");
  await mysqlConnection.rollback();
  await mysqlConnection.release();
  console.log("AFTER EACH : Connection released");
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
  it("Should register a new user in database", async () => {
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


  it("user with this email already exists in database", async () => {
    
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
  })


});

