const expressValidatorCallback = require("../expressValidatorCallback");
const {UserNameRule, UserNameOptionalRule, UserIdRule, UserEmailRule, OptionalUserEmailRule, UserPasswordConfirmationRule, UserPasswordRule, UserPhoneRule, UserRoleRule, UserCurrentPasswordRule } = require("../ValidationRules/UserRules");

// @desc: Validator for getting user by id from request params
// @usage: use this validator in routes to validate user id
// @note: this validator should be placed before the controller
module.exports.getUserByIdValidator = expressValidatorCallback([UserIdRule]);

// @desc: Validator for creating user
// @usage: use this validator in routes to validate user data
// @note: this validator should be placed before the controller
module.exports.createUserValidator = expressValidatorCallback([UserNameRule, UserEmailRule, UserPasswordConfirmationRule, UserPasswordRule, UserPhoneRule, UserRoleRule]);

// @desc: Validator for updating user
// @usage: use this validator in routes to validate user data
// @note: this validator should be placed before the controller
module.exports.updateUserValidator = expressValidatorCallback([UserIdRule, UserNameOptionalRule, OptionalUserEmailRule, UserPhoneRule]);

// @desc: Validator for updating user password
// @usage: use this validator in routes to validate user password
// @note: this validator should be placed before the controller
module.exports.updateUserPasswordValidator = expressValidatorCallback([UserIdRule, UserCurrentPasswordRule, UserPasswordConfirmationRule, UserPasswordRule]);

// @desc: Validator for updating user role
// @usage: use this validator in routes to validate user role
// @note: this validator should be placed before the controller
module.exports.updateUserRoleValidator = expressValidatorCallback([UserIdRule, UserRoleRule]);

// @desc: Validator for deleting user
// @usage: use this validator in routes to validate user id
// @note: this validator should be placed before the controller
module.exports.deleteUserValidator = expressValidatorCallback([UserIdRule]);