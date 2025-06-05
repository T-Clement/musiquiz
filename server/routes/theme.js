const express = require('express');
const router = express.Router();

const cache = require('../middleware/cache');
const themeCtrl = require('../controllers/theme');

const { body } = require("express-validator");


const Theme = require('../models/Theme');



router.get('/:id', themeCtrl.show);
router.get('/', cache("musiquiz.themes.index") ,themeCtrl.index);

module.exports = router;