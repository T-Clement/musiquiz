const mongoose = require("mongoose");
const pool = require('../db/index');
const fs = require('fs');

const request = require("supertest");
const app = require("../app");


const dumpFilePath = './tests/test-setup.sql';

let mysqlConnection;

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
  const dumpContent = fs.readFileSync(dumpFilePath, 'utf-8');

  try {

    await mysqlConnection.query(dumpContent);
    console.log("BEFORE EACH : Dump imported successfully");


  } catch (error) {
    console.error('BEFORE EACH : Error during importing dump : ', error.message);
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
    const res = await request(app).get('/api/ping');
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('pong');

  });
});
