const { validationResult } = require("express-validator");

// custom error formatter 
const errorFormatter = ({location, msg, path, value, nestedErrors}) => {
    return { field: path, message: msg};
}


const validateRequest = (req, res, next) => {
    // data coming from validator
  const errors = validationResult(req).formatWith(errorFormatter); // apply custom formatter

    // console.log(errors.array());

  // return errors with the message defined in the validator
  if (!errors.isEmpty()) {

    // construct errors object
        // field is the name of the input, message is the error message
    const errorsObject = errors.array().reduce((acc, err) => {
        if(!acc[err.field]) { // not overwrite with other errors on the same field, keep the first error
            acc[err.field] = err.message;
        }
        return acc;
    }, {});


    return res.status(400).json({ errors: errorsObject });
  }

  // no errors, go to next middleware
  next();
};

module.exports = validateRequest;