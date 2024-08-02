const express = require('express');
const router = express.Router();


const userCtrl = require('../controllers/user');

router.get('/:id', userCtrl.getOneUser);
// router.get('/:id', (req, res, next) => {
//     console.log(req.params);
//     res.status(200).json({message: "Yaaaay !"})
// });


module.exports = router;
