// const dbCo = require("../db");

const utils = require('../utils/utils');

const User = require('../models/User');


const { validationResult, matchedData } = require("express-validator");


exports.show = async (req, res, next) => {
    // get params of req
    const userId = parseInt(req.params.id);

    if(!userId) {
        throw new Error("");
        
    }

    try {
        const user = await User.findOneUserById(userId);

        if(!user) {
            return res.status(404).json({message: "User not found"});
        }

        res.status(200).json(user);


    } catch (error) {
        res.status(500).json({"message": "Servor Error"});
        console.log(`Error : ${error.message}`);
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
    

    // check if user with same mail exists
    if(!User.checkMail(email)) {
        return res.status(400).json({ message: "Un utilisateur s'est déjà enregistré avec cette addresse" })
    }

    // check if user with same pseudo exists
    if(!User.checkPseudo(pseudo)) {
        return res.status(400).json({ message: "Un utilisateur s'est déjà enregistré avec ce pseudo" })
    }


    // all good
    // encrypt passsword and send to database

    try {

        const saltRounds = 10;
        
        const hashedPassword = await utils.generatePasswordHash(password, saltRounds);
        
        console.log(password, hashedPassword);    
        
    } catch(error) {
        console.log(error, error.message);
    }
        
    res.status(200).json({ message: "data received" });




};

