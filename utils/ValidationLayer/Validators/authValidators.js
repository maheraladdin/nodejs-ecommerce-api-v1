const expressValidatorCallback = require("../expressValidatorCallback");
const {UserNameRule, UserEmailRule, UserEmailWithoutExistenceCheckRule, UserPasswordConfirmationRule, UserPasswordRule, UserPhoneRule, UserRoleRule,  } = require("../ValidationRules/authRules");

// @desc: Validator for sign up user
// @usage: use this validator in routes to validate user data
// @note: this validator should be placed before the controller
module.exports.signUpValidator = expressValidatorCallback([UserNameRule, UserEmailRule, UserPasswordConfirmationRule, UserPasswordRule, UserPhoneRule, UserRoleRule]);

// @desc: Validator for login user
// @usage: use this validator in routes to validate user data
// @note: this validator should be placed before the controller
module.exports.loginValidator = expressValidatorCallback([UserEmailWithoutExistenceCheckRule]);