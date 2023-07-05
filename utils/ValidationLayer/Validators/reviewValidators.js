const expressValidatorCallback = require("../expressValidatorCallback");
const {ReviewIdRule, ReviewProductIdRule, ReviewRatingRule, ReviewUserIdRule, ReviewIdRuleForDelete } = require("../ValidationRules/reviewRules");

// @desc: Validator for getting category by id from request params
// @usage: use this validator in routes to validate category id
// @note: this validator should be placed before the controller
module.exports.getReviewByIdValidator = expressValidatorCallback([ReviewIdRule]);

// @desc: Validator for creating category
// @usage: use this validator in routes to validate category data
// @note: this validator should be placed before the controller
module.exports.createReviewValidator = expressValidatorCallback([ReviewProductIdRule, ReviewUserIdRule, ReviewRatingRule]);

// @desc: Validator for updating category
// @usage: use this validator in routes to validate category data
// @note: this validator should be placed before the controller
module.exports.updateReviewValidator = expressValidatorCallback([ReviewRatingRule]);

// @desc: Validator for deleting category
// @usage: use this validator in routes to validate category id
// @note: this validator should be placed before the controller
module.exports.deleteReviewValidator = expressValidatorCallback([ReviewIdRuleForDelete]);