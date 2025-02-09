const { validationResult } = require("express-validator");

const validateRequest = (req, res, next) => {
    // data coming from validator
  const errors = validationResult(req);

    console.log("in middleware");

  // return errors with the message defined in the validator
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = validateRequest;