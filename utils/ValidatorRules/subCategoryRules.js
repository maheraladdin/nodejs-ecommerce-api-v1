const {check} = require("express-validator");

// @desc: Rule checks if category name is provided, and is between 3 and 50 characters long
// @usage: use this Rule inside expressValidatorCallback utility function
const subCategoryNameRule = check("name")
    .trim()
    .notEmpty()
    .withMessage("subCategory name is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("subCategory name must be between 2 and 50 characters long");

// @desc: Rule checks if category id is valid mongo id
// @usage: use this Rule inside expressValidatorCallback utility function
const subCategoryIdRule = check("id")
    .isMongoId()
    .withMessage("Invalid subcategory id format");

// @desc: Rule checks if parent category id is valid mongo id
// @usage: use this Rule inside expressValidatorCallback utility function
const parentSubCategoryIdRule = check("parentCategory")
    .isMongoId()
    .withMessage("Invalid parent category id format");

module.exports = {
    subCategoryNameRule,
    subCategoryIdRule,
    parentSubCategoryIdRule
}