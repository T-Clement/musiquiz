const request = require('supertest'); 
const app = require('../app');
const jwt = require('jsonwebtoken');


describe('authenticateJWT', () => {
    it("returns 401 when no token", async () => {
        const res = await request(app).get("/api/me");
        expect(res.statusCode).toBe(401);
    });
});

