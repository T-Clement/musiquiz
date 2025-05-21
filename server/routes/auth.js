const express = require('express');
const User = require('../models/User');
const { body, validationResult, matchedData } = require('express-validator');
const bcrypt = require('bcrypt');
const utils = require('../utils/utils');
const jwt = require('jsonwebtoken');
const { authenticateJWT } = require('../middleware/Auth');

const router = express.Router();



const validateLogin = [
    body('email')
        .trim()
        .escape()
        .isEmail().withMessage('L\'email doit être valide')
        .notEmpty().withMessage('L\'email est requis'),
    body('password')
        .trim()
        .escape()
        .isString().withMessage('Le mot de passe doit être une chaîne de caractères')
        .notEmpty().withMessage('Le mot de passe est requis'),
];

router.post("/api/login", validateLogin, async (req, res, next) => {


    // get errors comming from express-validator
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    // get validated data
    const validatedData = matchedData(req);

    const { email, password } = validatedData;

    // check if user exists with the credentials comming from post request and validated with validator
    User.findUserByMail(email).then(async user => {
        // no user
        if (user === null) {
            console.log("No user for this email");
            return res.status(401).json({ message: "Paire identifiant/mot de passe incorrect" })
        } else {
            // a user with this email has been found
            // check passwords hashs
            const valid = await bcrypt.compare(password, user.password)
            console.log(`validn value ${valid}`);
            if (!valid) {
                console.log("Invalid comparison of hashed passwords");
                res.status(500).json({ message: "Paire identifiant/mot de passe incorrect" });
            } else {
                console.log("Match, a user with correct credentials is found");

                user = new User(user.id, user.pseudo, null, user.email, user.createdAt, user.updatedAt);

                try {

                    // generate accessToken
                        // custom function to put only specific data in token
                    const accessToken = await utils.generateAccessToken(
                        user,
                        process.env.JWT_SECRET_KEY, 
                        process.env.TOKEN_EXPIRATION
                    );
                    
                    // generate refreshToken
                    const refreshToken = await utils.generateRefreshToken(
                        user, process.env.JWT_REFRESH_SECRET_KEY, 
                        process.env.REFRESH_EXPIRATION
                    );
                    
                    // send cookies
                    res.cookie('accessToken', accessToken, {
                        expires: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes expiration
                        httpOnly: true,
                        secure: process.env.NODE_ENV === "production" ? true : false
                    });
                    res.cookie('refreshToken', refreshToken, {
                        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days expiration
                        httpOnly: true,
                        secure: process.env.NODE_ENV === "production" ? true : false
                    }); 

                    res.status(200).json({ 
                        message: "Connexion Réussie", 
                        user: {
                            userId: user.id,
                            pseudo: user.pseudo
                        } 
                    });


                } catch (error) {
                    console.log("ERROR");
                    console.log(error);
                    res.status(500).json({ error });
                }
            }

        };
    })
        .catch(error => res.status(500).json({ error }));


});

router.post('/api/logout', authenticateJWT, (req, res) => {
    // set cookie to passed Date to delete it
    res.cookie('accessToken', '', {
        httpOnly: true,
        expires: new Date(0)
    });
    // set cookie to passed Date to delete it
    res.cookie('refreshToken', '', {
        httpOnly: true,
        expires: new Date(0)
    });
    res.status(200).json({ message: 'Déconnexion réussie, cookies supprimés' });
});

// NOT TESTED
router.get('/api/refresh-token', (req, res) => {



    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return res.status(401).json({ message: 'Non authentifié' });
    }

    // verify refresh token
    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Refresh token invalide ou expiré' });
        }

        console.log("dans le /api/refresh-token");
        console.log(user);
        // generate a new acces token
        const newAccessToken = jwt.sign(
            { userId: user.userId, pseudo: user.pseudo },
            process.env.JWT_SECRET_KEY,
            { expiresIn: process.env.TOKEN_EXPIRATION }
        );

        // store new JWT in httpOnly cookie
        res.cookie('accessToken', newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: 15 * 60 * 1000  // 15 minutes in ms
        });
        console.log(newAccessToken);
        res.status(200).json({ message: "Token renouvelé !", user: { userId: user.userId, pseudo: user.pseudo }});
    });
});

router.get("/api/me", authenticateJWT, (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: "Non authentifié" });
    }
    res.status(200).json({ message: "in user connected route", user: req.user });
});


module.exports = router;