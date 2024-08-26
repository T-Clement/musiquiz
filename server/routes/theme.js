const express = require('express');
const router = express.Router();


const themeCtrl = require('../controllers/theme');

const { body } = require("express-validator");


const validateRegisterUserTheme = [

];


const Theme = require('../models/Theme');



router.get('/:id', themeCtrl.show);
router.get('/', themeCtrl.index);

module.exports = router;