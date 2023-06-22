const {check} = require("express-validator");

// @desc: Rule checks if category name is provided, and is between 3 and 50 characters long
// @usage: use this Rule inside expressValidatorCallback utility function
const CategoryNameRule = check("name")
    .trim()
    .notEmpty()
    .withMessage("Category name is required")
    .isLength({ min: 3, max: 50 })
    .withMessage("Category name must be between 3 and 50 characters long");

// @desc: Rule checks if category id is valid mongo id
// @usage: use this Rule inside expressValidatorCallback utility function
const CategoryIdRule = check("id")
    .isMongoId()
    .withMessage("Invalid category id format");

// @desc: Rule checks if parent category id is valid mongo id
// @usage: use this Rule inside expressValidatorCallback utility function
const parentSubCategoryIdRule = check("parentCategory")
    .isMongoId()
    .withMessage("Invalid parent category id format");

module.exports = {
    CategoryNameRule,
    CategoryIdRule,
    parentSubCategoryIdRule
}