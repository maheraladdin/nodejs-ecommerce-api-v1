const {check} = require("express-validator");

// @desc: Rule checks if category name is provided, and is between 3 and 50 characters long
// @usage: use this Rule inside expressValidatorCallback utility function
const BrandNameRule = check("name")
    .trim()
    .notEmpty()
    .withMessage("Brand name is required")
    .isLength({ min: 3, max: 50 })
    .withMessage("Brand name must be between 3 and 50 characters long");

// @desc: Rule checks if category id is valid mongo id
// @usage: use this Rule inside expressValidatorCallback utility function
const BrandIdRule = check("id")
    .isMongoId()
    .withMessage("Invalid Brand id format");

module.exports = {
    BrandNameRule,
    BrandIdRule
}