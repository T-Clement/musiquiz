const express = require('express');
const router = express.Router();


const themeCtrl = require('../controllers/theme');

const { body } = require("express-validator");


const validateRegisterUserTheme = [

];




router.get('/:id', themeCtrl.show);


module.exports = router;