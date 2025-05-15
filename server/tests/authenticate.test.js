const request = require('supertest'); 
const app = require('../app');
const jwt = require('jsonwebtoken');
const pool = require('../db/index');
const utils = require("../utils/utils");
const User = require('../models/User');
const fs = require("fs");

const { Cookie, CookieAccessInfo } = require('cookiejar');

let mysqlTestConnection;
const dumpFilePath = "./tests/test-setup.sql";


describe("unit tests on jwt token functions", () => {
    
    
    test("generateAccessToken encode correctly values", async () => {
        const user = { id : 99, pseudo: "John" };
        const secret = "jwt-secret";

        const token = await utils.generateAccessToken(user, secret,'1h');
        const payload = jwt.verify(token, secret);
        expect(payload).toMatchObject({ userId: user.id, pseudo: user.pseudo });
        expect(payload.exp - payload.iat).toBe(3600);
    });


});



describe('authenticateJWT', () => {
    let agent; // keep cookies / token between requests
    let fakeUser ; // fakeUser inserted in database
    let credentials; // creadentials to logged in as fakeUser
    
    beforeAll(async() => {

        // agent (comes from supertest) is used to keep cookies 
        agent = request.agent(app);


        // open a database connection
        mysqlTestConnection = await pool.getConnection();
        await mysqlTestConnection.beginTransaction();
        
        
        const dumpContent = fs.readFileSync(dumpFilePath, 'utf-8');

        // initlialize database
        await mysqlTestConnection.query(dumpContent);
        
        const password = "secret123";
        const hashedPassword = await utils.generatePasswordHash(password, 10);
        
        // create a fake user in test database
        fakeUser = {
            pseudo: "John",
            email: "john@doe.com",
            password: hashedPassword
        };
    
        const insertedFakeUser = await User.insertNewUser(fakeUser.pseudo, fakeUser.password, fakeUser.email);
        fakeUser.id = insertedFakeUser.id;
        credentials = { email: fakeUser.email, password: password };

    });


    afterAll(async() => {
        // roolback of transaction to keep database clean
        await mysqlTestConnection.rollback();
        await mysqlTestConnection.release();
        await pool.end();
    })



    it("returns 401 when no token", async () => {
        const res = await request(app).get("/api/me");
        expect(res.statusCode).toBe(401);
    });

    
    it("successfully authenticate user", async() => {
        // log in fakeUser
        const login = await agent.post('/api/login').send(credentials);
        expect(login.statusCode).toEqual(200);

        // check if we can do a protected route, related to the current user connected
        const me = await agent.get("/api/me");
        expect(me.statusCode).toBe(200);
        console.log(me.body)
        expect(me.body.user).toMatchObject({ userId: fakeUser.id, pseudo: fakeUser.pseudo });
    });


    it("as a connected user, cannot access a route user owner id route", async () => {
        await agent.post("/api/login").send(credentials);

        const otherUserId = 1;
        const res = await agent.get(`/api/user/${otherUserId}`);
        expect(res.statusCode).toBe(403);
    });

    it.todo("cannot acces a auth protected route with invalid token");


    it("as a not connected user, cannot access a route link to a user", async () => {

        const res = await request(app).get(`/api/user/1`);
        expect(res.statusCode).toBe(401);
    });


    it("test accessToken newly generated due to valid refreshToken", async () => {
        
        
        
        // const someCookie = agent.jar.getCookie('accessToken', CookieAccessInfo.All);
        // console.log(someCookie);

        // expires cookie by setting a date in the past
        await agent.jar.setCookie(
        'accessToken=; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Path=/; HttpOnly'
        , "127.0.0.1");

        const after = agent.jar.getCookie('accessToken', CookieAccessInfo.All);

        const res = await agent.get('/api/me');
        // console.log(res.body);
        expect(res.statusCode).toBe(200);

        

    });




});

