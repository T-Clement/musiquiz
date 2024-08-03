// const dbCo = require("../db");

const User = require('../models/User');


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