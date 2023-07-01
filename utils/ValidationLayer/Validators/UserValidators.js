const expressValidatorCallback = require("../expressValidatorCallback");
const {UserNameRule, UserNameOptionalRule, UserIdRule, UserEmailRule, OptionalUserEmailRule, UserPasswordConfirmationRule, UserPasswordRule, OptionalUserPasswordRule, UserPhoneRule, UserRoleRule } = require("../ValidationRules/UserRules");

// @desc: Validator for getting category by id from request params
// @usage: use this validator in routes to validate category id
// @note: this validator should be placed before the controller
module.exports.getUserByIdValidator = expressValidatorCallback([UserIdRule]);

// @desc: Validator for creating category
// @usage: use this validator in routes to validate category data
// @note: this validator should be placed before the controller
module.exports.createUserValidator = expressValidatorCallback([UserNameRule, UserEmailRule, UserPasswordConfirmationRule, UserPasswordRule, UserPhoneRule, UserRoleRule]);

// @desc: Validator for updating category
// @usage: use this validator in routes to validate category data
// @note: this validator should be placed before the controller
module.exports.updateUserValidator = expressValidatorCallback([UserIdRule, UserNameOptionalRule,OptionalUserEmailRule, UserPasswordConfirmationRule, OptionalUserPasswordRule, UserPhoneRule, UserRoleRule]);

// @desc: Validator for deleting category
// @usage: use this validator in routes to validate category id
// @note: this validator should be placed before the controller
module.exports.deleteUserValidator = expressValidatorCallback([UserIdRule]);