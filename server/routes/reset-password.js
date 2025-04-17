const express = require('express');
const router = express.Router();

const brcypt = require('bcrypt');
const crypto = require('crypto');
const User = require('../models/User');
const ResetPassword = require('../models/ResetPassword');
const { sendResetPasswordEmail } = require('../services/emailService');
const {body, validationResult} = require('express-validator');
const InputValidationMessage = require('../models/InputValidationMessage');
const utils = require('../utils/utils');

router.post("/api/request-password-reset", [body("email")
    .trim()
    .escape()
    .isEmail().withMessage("L'email n'est pas valide")
    ], 
    async (req, res) => {

    try {

    // validate data coming from request
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()}); 
    }


    // what to do if a request to reset the password is already in database ???



    // get mail from post + NEED TO VALIDATE DATA
    const { email } = req.body;
    
    // get associated user
    const user = await User.findUserByMail(email);

    // send api response who act as a match is find 
    // to avoid giving info about users in the databse
    if(!user) {
        console.log("reset password request made but no user found with email : ", email);
        return res.status(200).json({ message: "Si cet email existe, vous recevrez un lien de réinitialisation." });
    }


    // delete expired previous requests
    const result = await ResetPassword.deleteExpiredRequests();
    console.log(result);
    

    // check if a non expired request exists in database
    let token = await ResetPassword.findActiveRequestByUser(user.id);
    if(!token) {
        // generate token 
        token = crypto.randomBytes(parseInt(process.env.TOKEN_LENGTH)).toString('hex');
    
        // generate expiration
        const now = new Date();
        const expirationTimeInMilliseconds = now.getTime() + (4 * 60 * 60 * 1000); // add 4 hours in milliseconds
        const expirationDate = new Date(expirationTimeInMilliseconds).toISOString().slice(0, 19).replace('T', ' ');
        token = await ResetPassword.insertNewPasswordRequest(user.id, token, expirationDate);
    } 


    const resetLink = `${process.env.FRONT_URL}/reset-password?token=${token}`;

    console.log(resetLink);

    // -------------------------------
    // send mail
    // -------------------------------

    sendResetPasswordEmail(user.email, resetLink)
        .catch(err => console.error('Error sending of mail about getting password reset token link'))


    return res.status(200).json({ message: "Si cet email existe, vous recevrez un lien de réinitialisation." });

} catch (err) {
    console.error('Error handling password reset request:', err);
        return res.status(500).json({ message: "Une erreur est survenue lors du traitement de votre demande de réinitialisation de mot de passe." });
}



});


router.post("/api/reset-password", [
    body("token")
        .trim()
        .escape(), // sanitize data
        // .isLength({min: process.env.TOKEN_LENGTH, max: process.env.TOKEN_LENGTH}).withMessage('Le token est invalide'),
    body("password")
        .trim()
        .escape() // sanitize data
        .notEmpty().withMessage(InputValidationMessage.MISSING_PASSWORD)
        .isString().withMessage("Le mot de passe doit être une chaîne de caractères")
        .isLength({min : 8}).withMessage(InputValidationMessage.PASSWORD_TO_SHORT)
    ], async (req, res) => {

    try {

        // validate data coming from request
        const errors = validationResult(req);

        if(!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()}); 
        }

        const { token, password } = req.body;

        // // check token is associated with user id with this email
        // check if request is still valid / not expired
        const request = await ResetPassword.findActiveRequestByToken(token);
        if(!request) {
            return res.status(400).json({ message: "Token invalide ou expiré" });
        }

        // console.log(request);

        // update password
        // where to take the userId ? -> from token registration in database
        const user = await User.findOneUserById(request.id_user); // key return by request
        if(!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        // create hash of new password
        const saltRounds = 10;
        const hashedNewPassword = await utils.generatePasswordHash(password, saltRounds);

        // update user credentials in users table
        await User.updatePassword(user.id, hashedNewPassword);

        // set token as used in table request reset password, with datetime
        await ResetPassword.markRequestAsUsed(request.id);

        return res.status(200).json({ message: "Votre mot de passe a été mis à jour avec succès." });
    

    } catch (err) {
        console.log(err.message);
        return res.status(500).json({message: "Une erreur serveur a eu lieu"});
    }



});







module.exports = router;


