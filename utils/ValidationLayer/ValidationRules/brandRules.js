const {optionalRequireLengthRule, idRule} = require("./RulesFactory");

/**
 * @desc: Rule checks if brand name is provided, and is between 3 and 50 characters long
 */
module.exports.BrandNameRule = optionalRequireLengthRule("Brand");

/**
 * @desc: Rule checks optionally if brand name is provided, and is between 3 and 50 characters long
 */
module.exports.BrandNameOptionalRule = optionalRequireLengthRule("Brand", {optional: true});

/**
 * @desc: Rule checks if brand id is valid mongo id
 */
module.exports.BrandIdRule = idRule("Brand");