const request = require('supertest'); 
const app = require('../app');
const jwt = require('jsonwebtoken');

const utils = require("../utils/utils");

describe("unit tests on jwt token functions", () => {
    
    
    test("generateAccessToken encode correctly values", async () => {
        const user = { id : 99, pseudo: "John" };
        const secret = "jwt-secret";

        const token = await utils.generateAccessToken(user, secret,'1h');
        const payload = jwt.verify(token, secret);
        console.log(payload, user)
        expect(payload).toMatchObject({ userId: user.id, pseudo: user.pseudo });
    });


});



describe('authenticateJWT', () => {


    it("returns 401 when no token", async () => {
        const res = await request(app).get("/api/me");
        expect(res.statusCode).toBe(401);
    });

    
    it.todo("successfully authenticate user");

    it.todo("cannot access a auth protected route");

    it.todo("cannot access a route user owner id route");


});

