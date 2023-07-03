const expressValidatorCallback = require("../expressValidatorCallback");
const {UserNameRule, UserEmailRule, UserEmailWithoutExistenceCheckRule, UserPasswordConfirmationRule, UserPasswordRule, UserPhoneRule, UserRoleRule, UserResetPasswordTokenRule  } = require("../ValidationRules/authRules");

// @desc: Validator for sign up user
// @usage: use this validator in routes to validate user data
// @note: this validator should be placed before the controller
module.exports.signUpValidator = expressValidatorCallback([UserNameRule, UserEmailRule, UserPasswordConfirmationRule, UserPasswordRule, UserPhoneRule, UserRoleRule]);

// @desc: Validator for login user
// @usage: use this validator in routes to validate user data
// @note: this validator should be placed before the controller
module.exports.loginValidator = expressValidatorCallback([UserEmailWithoutExistenceCheckRule]);

// @desc: Validator for forget password
// @usage: use this validator in routes to validate user data
// @note: this validator should be placed before the controller
module.exports.forgetPasswordValidator = expressValidatorCallback([UserEmailWithoutExistenceCheckRule]);

// @desc: Validator for verify password reset token
// @usage: use this validator in routes to validate user data
// @note: this validator should be placed before the controller
module.exports.verifyPasswordResetTokenValidator = expressValidatorCallback([UserResetPasswordTokenRule]);

// @desc: Validator for reset password
// @usage: use this validator in routes to validate user data
// @note: this validator should be placed before the controller
module.exports.resetPasswordValidator = expressValidatorCallback([UserEmailWithoutExistenceCheckRule, UserPasswordConfirmationRule, UserPasswordRule]);