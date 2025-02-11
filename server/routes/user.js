const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');

const InputValidationMessage = require("../models/InputValidationMessage");

const { body } = require("express-validator");
const validateRequest = require('../middleware/validateRequest');

// ------------------------------------------- //
// SANITIZE DATA //
// ------------------------------------------- //
const validateRegisterUser = [
    body("pseudo")
        .trim()
        .escape() // sanitize data
        .notEmpty().withMessage(InputValidationMessage.MISSING_PSEUDO)
        .isString().withMessage("Le pseudo doit être une chaine de caractères")
        .isLength({min : 3}).withMessage(InputValidationMessage.PSEUDO_TO_SHORT),
    body("email")
        .trim()
        .escape() // sanitize data
        .notEmpty().withMessage('Le champ email est requis')
        .isEmail().withMessage(InputValidationMessage.NOT_VALID_EMAIL), // add a custom() to check if email is already in use, and to check if password === password confirmation field
    body("password")
        .trim()
        .escape() // sanitize data
        .notEmpty().withMessage(InputValidationMessage.MISSING_PASSWORD)
        .isString().withMessage("Le mot de passe doit être une chaîne de caractères")
        .isLength({min : 8}).withMessage(InputValidationMessage.PASSWORD_TO_SHORT)

];



// validation middleware  
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










router.get('/:id', userCtrl.show);

router.post("/register", validateRegisterUser, validateRequest, userCtrl.create);

// router.post("/login", validateLogin, userCtrl.login);

module.exports = router;
