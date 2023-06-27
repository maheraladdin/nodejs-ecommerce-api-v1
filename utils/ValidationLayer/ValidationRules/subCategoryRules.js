const categoryExists = require("../CustomValidationRules/categoryExists");
const {optionalRequireLengthRule, idRule} = require("./RulesFactory");


const min = 2;
const optional = true;

/**
 * @desc: Rule checks if subCategory name is provided, and is between 2 and 50 characters long
 */
module.exports.subCategoryNameRule = optionalRequireLengthRule("SubCategory",{min});

/**
 * @desc: Rule checks optionally if subCategory name is provided, and is between 2 and 50 characters long
 */
module.exports.optionalSubCategoryNameRule = optionalRequireLengthRule("SubCategory",{min,optional});

/**
 * @desc: Rule checks if subCategory id is valid mongo id
 */
module.exports.subCategoryIdRule = idRule("SubCategory");

/**
 * @desc: Rule checks if category id is valid mongo id
 */
module.exports.categoryIdRule = idRule("Category", {field: "category"})
    .custom(categoryExists);

/**
 * @desc: Rule checks optionally if category id is valid mongo id
 */
module.exports.optionalCategoryIdRule = idRule("Category", {field: "category",optional})
    .custom(categoryExists);
