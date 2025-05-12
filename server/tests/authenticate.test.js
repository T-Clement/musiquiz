const request = require('supertest'); 
const app = require('../app');
const jwt = require('jsonwebtoken');


describe('authenticateJWT', () => {
    it("returns 401 when no token", async () => {
        const res = await request(app).get("/api/me");
        expect(res.statusCode).toBe(401);
    });

    
    it.todo("successfully authenticate user");

    it.todo("cannot access a auth protected route");

    it.todo("cannot access a route user owner id route");


});

