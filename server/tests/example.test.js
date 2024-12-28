const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../server");

// /* Connecting to the database before each test. */
// beforeEach(async () => {
//   await mongoose.connect(process.env.MONGODB_URI);
// });

// /* Closing database connection after each test. */
// afterEach(async () => {
//   await mongoose.connection.close();
// });

describe("GET api/ping", () => {
  it("it is a test", async () => {
    expect(true).toBe(true);
  });
});
