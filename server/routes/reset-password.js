const express = require('express');
const router = express.Router();

const brcypt = require('bcrypt');
const crypto = require('crypto');
const User = require('../models/User');
const ResetPassword = require('../models/ResetPassword');
const { sendResetPasswordEmail } = require('../services/emailService');


router.post("/api/request-password-reset", async (req, res) => {

    try {


    // what to do if a request to reset the password is already in database ???



    // get mail from post
    const { email } = req.body;
    
    // get associated user
    const user = await User.findUserByMail(email);

    // send api response who act as a match is find 
    // to avoid giving info about users in the databse
    if(!user) {
        return res.status(200).json({ message: "Si cet email existe, vous recevrez un lien de réinitialisation." });
    }


    // delete expired previous requests
    /// ...

    // check if a non expired request exists in database
    let token = await ResetPassword.findActiveRequestByUser(user.id);
    if(!token) {
        // generate token 
        token = crypto.randomBytes(32).toString('hex');
    
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

    // sendResetPasswordEmail(user.email, resetLink)
    //     .catch(err => console.error('Error sending of mail about getting password reset token link'))


    return res.status(200).json({ message: "Si cet email existe, vous recevrez un lien de réinitialisation." });

} catch (err) {
    console.error('Error handling password reset request:', err);
        return res.status(500).json({ message: "Une erreur est survenue lors du traitement de votre demande de réinitialisation de mot de passe." });
}



});


router.post("/api/reset-password", async (req, res) => {

});







module.exports = router;


