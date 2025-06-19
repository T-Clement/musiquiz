const express = require('express');
const router = express.Router();

const gameController = require("../controllers/gameSQL");

const cache = require('../middleware/cache');



router.get("/top3", cache("musiquiz.top3") ,gameController.top3);

module.exports = router;
