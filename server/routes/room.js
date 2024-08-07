const express = require('express');
const router = express.Router();

const roomCtrl = require("../controllers/room");

const { body } = require("express-validator");


const validateRegisterUserTheme = [

];

router.get('/:id', roomCtrl.show);

module.exports = router;
