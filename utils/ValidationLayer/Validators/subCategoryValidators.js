const expressValidatorCallback = require("../expressValidatorCallback");

const {
    subCategoryNameRule,
    optionalSubCategoryNameRule,
    subCategoryIdRule,
    categoryIdRule,
    optionalCategoryIdRule } = require("../ValidationRules/subCategoryRules");


// @desc: Validator for creating subCategory by name ,and id from request body
// @usage: use this validator in routes to validate subCategory data
// @note: this validator should be placed before the controller
module.exports.createSubCategoryValidator = expressValidatorCallback(
    [subCategoryNameRule, categoryIdRule]
);

// @desc: Validator for getting subCategory by id from request params
// @usage: use this validator in routes to validate subCategory data
// @note: this validator should be placed before the controller
module.exports.getSubCategoryByIdValidator = expressValidatorCallback([subCategoryIdRule]);

// @desc: Validator for updating subCategory by id from request params and name from request body
// @usage: use this validator in routes to validate subCategory data
// @note: this validator should be placed before the controller
module.exports.updateSubCategoryValidator = expressValidatorCallback(
    [subCategoryIdRule, optionalSubCategoryNameRule, optionalCategoryIdRule]
);

// @desc: Validator for deleting subCategory by id from request params
// @usage: use this validator in routes to validate subCategory data
// @note: this validator should be placed before the controller
module.exports.deleteSubCategoryByIdValidator = expressValidatorCallback([subCategoryIdRule]);