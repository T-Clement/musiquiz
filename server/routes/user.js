const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');

const { body } = require("express-validator");


const validateRegisterUser = [
    body("pseudo")
        .trim()
        .escape()
        .notEmpty().withMessage("Le champ pseudo est requis")
        .isString().withMessage("Le pseudo doit être une chaine de caractères")
        .isLength({min : 3}).withMessage("Le pseudo doit faire plus de 3 caractères"),
    body("email")
        .trim()
        .escape()
        .notEmpty().withMessage('Le champ email est requis')
        .isEmail().withMessage('L\'email n\'est pas valide'), // add a custom() to check if email is already in use, and to check if password === password confirmation field
    body("password")
        .trim()
        .escape()
        .notEmpty().withMessage('Le champ password est requis')
        .isString().withMessage("Le mot de passe doit être une chaîne de caractères")
        .isLength({min : 8}).withMessage('Le mot de passe doit faire plus de 8 caractères')

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

router.post("/register", validateRegisterUser, userCtrl.create);

// router.post("/login", validateLogin, userCtrl.login);

module.exports = router;
