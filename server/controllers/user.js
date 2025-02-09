// const dbCo = require("../db");

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const utils = require('../utils/utils');

const User = require('../models/User');


const { validationResult, matchedData } = require("express-validator");


exports.show = async (req, res, next) => {
    // get params of req
    const userId = parseInt(req.params.id);

    if(!userId) {
        return next(new Error("Param missing in User get request"));
        
    }

    try {
        const user = await User.findOneUserById(userId);

        if(!user) {
            return res.status(404).json({message: "User not found"});
        }

        res.status(200).json(user);


    } catch (error) {
        res.status(500).json({"message": "Servor Error"});
        next(error);
    }
};


exports.create = async (req, res, next) => {

    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    
    const validatedData = matchedData(req);
    
    const { pseudo, email, password } = validatedData;
    
    console.log(pseudo, email, password);
    

    try {

        // check if user with same pseudo exists
        const pseudoExists = await User.checkPseudo(pseudo);
        console.log('pseudo exists : '  + pseudoExists);

        if(!pseudoExists ) {
            return res.status(400).json({ message: User.errorsMessages.pseudoAlreadyExists })
        }


        // check if user with same mail exists
        const emailExists = await User.checkMail(email);
        console.log('mail exists : '  + emailExists);
        if(!emailExists) {
            return res.status(400).json({ message: User.errorsMessages.emailAlreadyExists });
        }


        // all good
        // encrypt passsword and send to database

        const saltRounds = 10;
        const hashedPassword = await utils.generatePasswordHash(password, saltRounds);
        
        const insertedUser =  await User.insertNewUser(pseudo, hashedPassword, email);
        
        return res.status(201).json({  message: "Utilisateur créé avec succès", user: insertedUser });
        
    } catch(error) {
        console.log(error, error.message);
        return res.status(500).json({ message: error.message });
    }
        

};



// exports.login = async (req, res, next) => {


//     // get errors comming from express-validator
//     const errors = validationResult(req);

//     if(!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() })
//     }

//     // get validated data
//     const validatedData = matchedData(req);

//     const { email, password } = validatedData;

//     console.log(email, password);

//     // check if user exists with the credentials comming from post request and validated with validator
//     User.findUserByMail(email).then(user => {
//         // no user
//         if(user === null) {
//             console.log("No user for this email");
//             return res.status(401).json({message: "Paire identifiant/mot de passe incorrect"})
//         } else {
//             // a user with this email has been found
//             // check passwords hashs
//             bcrypt.compare(password, user.password)
//             .then(valid => {
//                 if(!valid) {
//                     console.log("Invalid comparison of hashed passwords");
//                     res.status(500).json({ message: "Paire identifiant/mot de passe incorrect" });
//                 } else {
//                     console.log("Match, a user with correct credentials is found");
                    
//                     const user = new User(user.id, user.pseudo, null, user.email, user.createdAt, user.updatedAt);

//                     try {
//                         console.log(process.env.TOKEN_SENTENCE);

//                         // generate accessToken
//                         const accessToken = utils.generateAccessToken(user, process.env.JWT_SECRET_KEY, process.env.TOKEN_EXPIRATION);
                        
//                         // generate refreshToken
//                         const refreshToken = utils.generateRefreshToken(user, process.env.JWT_REFRESH_SECRET_KEY, process.env.REFRESH_EXPIRATION);

//                         // send cookies
//                         res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: false, sameSite: 'Strict' }); // secure to true if https
//                         res.cookie('jwtToken', accessToken, {httpOnly: true, sameSite: 'Strict'});

//                         res.status(200).json({message: "Connexion Réussie"});
                         

//                     } catch(error) {
//                         console.log(error);
//                         res.status(500).json({error});
//                     }
//                 }
//             })
//             .catch(error => res.status(500).json({ error }));
//         };
//     })
//     .catch(error => res.status(500).json({error}));
    

// }


// exports.login = (req, res, next) => {
//     User.findOne({email: req.body.email})
//     .then(user => {
//         if(user === null) {
//             res.status(401).json({message: "Paire identifiant/mot de passe incorrect"}); // message volontairement flou pour ne pas donner d'infos
//         } else {
//             bcrypt.compare(req.body.password, user.password)
//             .then(valid => {
//                 if(!valid) {
//                     res.status(500).json({ message: "Paire identifiant/mot de passe incorrect" });
//                 } else {
//                     res.status(200).json({
//                         userId: user._id,
//                         token: jwt.sign(
//                             { userId: user._id }, config.token.sentence, { expiresIn: '24h' }
//                         )
//                     });
//                 }
//             })
//             .catch(error => res.status(500).json({ error }));
//         };
//     })
//     .catch(error => res.status(500).json({error}));
// };