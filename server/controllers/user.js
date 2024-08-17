// const dbCo = require("../db");

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
            return res.status(400).json({ message: "Un utilisateur s'est déjà enregistré avec ce pseudo" })
        }


        // check if user with same mail exists
        const emailExists = await User.checkMail(email);
        console.log('mail exists : '  + emailExists);
        if(!emailExists) {
            return res.status(400).json({ message: "Un utilisateur s'est déjà enregistré avec cette addresse" })
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



exports.login = async (req, res, next) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const validatedData = matchedData(req);

    const { email, password } = validatedData;


}

