const {check} = require("express-validator");
const categoryExists = require("../CustomValidationRules/categoryExists");

// @desc: Rule checks if subCategory name is provided, and is between 2 and 50 characters long
// @usage: use this Rule inside expressValidatorCallback utility function
module.exports.subCategoryNameRule = check("name")
    .trim()
    .notEmpty()
    .withMessage("subCategory name is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("subCategory name must be between 2 and 50 characters long");

// @desc: Rule checks optionally if subCategory name is provided, and is between 2 and 50 characters long
// @usage: use this Rule inside expressValidatorCallback utility function
module.exports.optionalSubCategoryNameRule = check("name")
    .optional()
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

// @desc: Rule checks if category id for subCategory is valid mongo id
// @usage: use this Rule inside expressValidatorCallback utility function
module.exports.categoryIdRule = check("category")
    .isMongoId()
    .withMessage("Invalid parent category id format")
    .custom(categoryExists);

// @desc: Rule checks optionally if category id for subCategory is valid mongo id
// @usage: use this Rule inside expressValidatorCallback utility function
module.exports.optionalCategoryIdRule = check("category")
    .optional()
    .isMongoId()
    .withMessage("Invalid parent category id format")
    .custom(categoryExists);
