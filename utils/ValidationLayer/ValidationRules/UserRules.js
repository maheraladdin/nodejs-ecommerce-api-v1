const {optionalRequireLengthRule, idRule} = require("./RulesFactory");
const {check} = require("express-validator");

/**
 * @desc: Rule checks if Username is provided, and is between 3 and 50 characters long
 */
module.exports.UserNameRule = optionalRequireLengthRule("User");

/**
 * @desc: Rule checks optionally if Username is provided, and is between 3 and 50 characters long
 */
module.exports.UserNameOptionalRule = optionalRequireLengthRule("User", {optional: true});

module.exports.UserEmailRule = check("email")
    .trim()
    .isEmail()
    .withMessage("Please provide a valid email")
    .toLowerCase();

/**
 * @desc: Rule checks if User id is valid mongo id
 */
module.exports.UserIdRule = idRule("User");