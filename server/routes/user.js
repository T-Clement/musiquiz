const express = require('express');
const router = express.Router();


const userCtrl = require('../controllers/user');

router.get('/:id', userCtrl.getOneUser);



module.exports = router;
