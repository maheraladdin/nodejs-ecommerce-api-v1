const expressValidatorCallback = require("../../expressValidatorCallback");
const {BrandNameRule, BrandIdRule } = require("../ValidationRules/brandRules");

// @desc: Validator for getting category by id from request params
// @usage: use this validator in routes to validate category id
// @note: this validator should be placed before the controller
module.exports.getBrandByIdValidator = expressValidatorCallback([BrandIdRule]);

// @desc: Validator for creating category
// @usage: use this validator in routes to validate category data
// @note: this validator should be placed before the controller
module.exports.createBrandValidator = expressValidatorCallback([BrandNameRule]);

// @desc: Validator for updating category
// @usage: use this validator in routes to validate category data
// @note: this validator should be placed before the controller
module.exports.updateBrandValidator = expressValidatorCallback([BrandIdRule, BrandNameRule]);

// @desc: Validator for deleting category
// @usage: use this validator in routes to validate category id
// @note: this validator should be placed before the controller
module.exports.deleteBrandValidator = expressValidatorCallback([BrandIdRule]);