const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../app");

require("dotenv").config();


// /* Connecting to the database before each test. */
// beforeEach(async () => {
//   await mongoose.connect(process.env.MONGODB_URI);
// });

// /* Closing database connection after each test. */
// afterEach(async () => {
//   await mongoose.connection.close();
// });




describe("GET api/ping", () => {
  it("Test route to check if server is alive", async () => {
    const res = await request(app).get('/api/ping');
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('pong');

  });
});
