const {check} = require("express-validator");

// @desc: Rule checks if subCategory name is provided, and is between 2 and 50 characters long
// @usage: use this Rule inside expressValidatorCallback utility function
module.exports.subCategoryNameRule = check("name")
    .trim()
    .notEmpty()
    .withMessage("subCategory name is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("subCategory name must be between 2 and 50 characters long");

// @desc: Rule checks if subCategory id is valid mongo id
// @usage: use this Rule inside expressValidatorCallback utility function
module.exports.subCategoryIdRule = check("id")
    .isMongoId()
    .withMessage("Invalid subcategory id format");

// @desc: Rule checks if parent category id for subCategory is valid mongo id
// @usage: use this Rule inside expressValidatorCallback utility function
module.exports.parentSubCategoryIdRule = check("parentCategory")
    .isMongoId()
    .withMessage("Invalid parent category id format");