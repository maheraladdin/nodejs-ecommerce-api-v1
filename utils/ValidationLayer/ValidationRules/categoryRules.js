const {optionalRequireLengthRule, idRule} = require("./RulesFactory");

/**
 * @desc: Rule checks if category name is provided, and is between 3 and 50 characters long
 */
module.exports.CategoryNameRule = optionalRequireLengthRule("Category");

/**
 * @desc: Rule checks optionally if category name is provided, and is between 3 and 50 characters long
 */
module.exports.CategoryNameOptionalRule = optionalRequireLengthRule("Category", {optional: true});

/**
 * @desc: Rule checks if category id is valid mongo id
 */
module.exports.CategoryIdRule = idRule("Category");