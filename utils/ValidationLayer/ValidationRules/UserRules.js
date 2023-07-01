const {optionalRequireLengthRule, idRule} = require("./RulesFactory");
const {check} = require("express-validator");
const emailExists = require("../CustomValidationRules/emailExists");
const emailNormalize = require("../CustomValidationRules/emailNormlize");
const phoneExists = require("../CustomValidationRules/phoneExists");
const passwordConfirmation = require("../CustomValidationRules/passwordConfirmation");

/**
 * @desc: Rule checks if Username is provided, and is between 3 and 50 characters long
 */
module.exports.UserNameRule = optionalRequireLengthRule("User");

/**
 * @desc: Rule checks optionally if Username is provided, and is between 3 and 50 characters long
 */
module.exports.UserNameOptionalRule = optionalRequireLengthRule("User", {optional: true});

/**
 * @desc: Rule checks if User email is provided, is valid email, and is not already in use
 */
module.exports.UserEmailRule = check("email")
    .trim()
    .notEmpty()
    .withMessage("Please provide an email")
    .isEmail()
    .withMessage("Please provide a valid email")
    .custom(emailNormalize)
    .custom(emailExists);
/**
 * @desc: Rule checks optionally if User email is provided, is valid email, and is not already in use
 */
module.exports.OptionalUserEmailRule = check("email")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Please provide an email")
    .isEmail()
    .withMessage("Please provide a valid email")
    .custom(emailNormalize)
    .custom(emailExists);

/**
 * @desc: Rule checks password confirmation
 */
module.exports.UserPasswordConfirmationRule = check("passwordConfirmation")
    .trim()
    .notEmpty()
    .withMessage("passwordConfirmation is required");

/**
 * @desc: Rule checks if User password is provided, and is between 6 and 50 characters long
 */
module.exports.UserPasswordRule = check("password")
    .trim()
    .notEmpty()
    .withMessage("Please provide a password")
    .isStrongPassword({minLength: 6})
    .withMessage("Password must be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, one number and one symbol")
    .custom(passwordConfirmation);

/**
 * @desc: Rule checks optionally if User password is provided, and is between 6 and 50 characters long
 */
module.exports.OptionalUserPasswordRule = check("password")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Please provide a password")
    .isStrongPassword({minLength: 6})
    .withMessage("Password must be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, one number and one symbol")
    .custom(passwordConfirmation);

/**
 * @desc: Rule checks optionally if User phone is provided, and is valid phone number
 */
module.exports.UserPhoneRule = check("phone")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Please provide a phone number")
    // only accept phone number from Egypt and Saudi Arabia
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("Please provide a valid phone number from Egypt or Saudi Arabia")
    .custom(phoneExists);

/**
 * @desc: Rule checks optionally if User role is provided, and is valid role
 */
module.exports.UserRoleRule = check("role")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Please provide a valid role")
    .isIn(["user", "admin"])
    .withMessage("Please provide a valid role");


/**
 * @desc: Rule checks if User id is valid mongo id
 */
module.exports.UserIdRule = idRule("User");