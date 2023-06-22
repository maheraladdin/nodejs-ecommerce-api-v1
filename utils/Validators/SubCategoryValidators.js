const expressValidatorCallback = require("../expressValidatorCallback");

const {CategoryNameRule, CategoryIdRule, parentSubCategoryIdRule } = require("../ValidatorRules/CategoryRules");

// @desc: Validator for creating subCategory by name ,and id from request body
// @usage: use this validator in routes to validate subCategory data
// @note: this validator should be placed before the controller
module.exports.createSubCategoryValidator = expressValidatorCallback([CategoryNameRule, parentSubCategoryIdRule]);

// @desc: Validator for getting subCategory by id from request params
// @usage: use this validator in routes to validate subCategory data
// @note: this validator should be placed before the controller
module.exports.getSubCategoryByIdValidator = expressValidatorCallback([CategoryIdRule]);

// @desc: Validator for updating subCategory by id from request params and name from request body
// @usage: use this validator in routes to validate subCategory data
// @note: this validator should be placed before the controller
module.exports.updateSubCategoryNameAndSubCategoryParentCategoryByIdValidator = expressValidatorCallback([CategoryIdRule, CategoryNameRule, parentSubCategoryIdRule]);

// @desc: Validator for deleting subCategory by id from request params
// @usage: use this validator in routes to validate subCategory data
// @note: this validator should be placed before the controller
module.exports.deleteSubCategoryByIdValidator = expressValidatorCallback([CategoryIdRule]);