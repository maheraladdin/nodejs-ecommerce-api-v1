const expressValidatorCallback = require("../expressValidatorCallback");
const {CategoryNameRule, CategoryIdRule } = require("../ValidationRules/categoryRules");

// @desc: Validator for getting category by id from request params
// @usage: use this validator in routes to validate category id
// @note: this validator should be placed before the controller
module.exports.getCategoryByIdValidator = expressValidatorCallback([CategoryIdRule]);

// @desc: Validator for creating category
// @usage: use this validator in routes to validate category data
// @note: this validator should be placed before the controller
module.exports.createCategoryValidator = expressValidatorCallback([CategoryNameRule]);

// @desc: Validator for updating category
// @usage: use this validator in routes to validate category data
// @note: this validator should be placed before the controller
module.exports.updateCategoryValidator = expressValidatorCallback([CategoryIdRule, CategoryNameRule]);

// @desc: Validator for deleting category
// @usage: use this validator in routes to validate category id
// @note: this validator should be placed before the controller
module.exports.deleteCategoryValidator = expressValidatorCallback([CategoryIdRule]);
