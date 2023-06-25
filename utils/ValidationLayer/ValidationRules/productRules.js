const {check} = require("express-validator");
const categoryExists = require("../CustomValidationRules/categoryExists");
const DiscountedPriceLessThanPrice = require("../CustomValidationRules/DiscountedPriceLessThanPrice");
const subCategoryExists = require("../CustomValidationRules/subCategoryExists");
const brandExists = require("../CustomValidationRules/brandExists");
const notRedundant = require("../CustomValidationRules/notRedundant");
const subCategoriesBelongToCategory = require("../CustomValidationRules/subCategoriesBelongToCategory");

// @desc: Rule checks if product title is provided, and is between 3 and 50 characters long
// @usage: use this Rule inside expressValidatorCallback utility function
module.exports.ProductNameRule = check("title")
    .trim()
    .notEmpty()
    .withMessage("Product title is required")
    .isLength({ min: 3, max: 100 })
    .withMessage("Product title must be between 3 and 100 characters long");

// @desc: Rule checks if product description is provided, and is between 20 and 5000 characters long
// @usage: use this Rule inside expressValidatorCallback utility function
module.exports.ProductDescriptionRule = check("description")
    .trim()
    .notEmpty()
    .withMessage("Product description is required")
    .isLength({ min: 20, max: 5000 })
    .withMessage("Product description must be between 20 and 5000 characters long");

// @desc: Rule checks if product quantity is provided, and is greater than 0
// @usage: use this Rule inside expressValidatorCallback utility function
module.exports.ProductQuantityRule = check("quantity")
    .notEmpty()
    .withMessage("Product quantity is required")
    .isNumeric()
    .withMessage("Product quantity must be a number")
    .isInt({ min: 1 })
    .withMessage("Product quantity must be greater than 0");

// @desc: Rule checks if product sold is provided
// @usage: use this Rule inside expressValidatorCallback utility function
module.exports.ProductSoldRule = check("sold")
    .optional()
    .isNumeric()
    .withMessage("Product sold must be a number");

// @desc: Rule checks if product price is provided, and is greater than 0
// @usage: use this Rule inside expressValidatorCallback utility function
module.exports.ProductPriceRule = check("price")
    .notEmpty()
    .withMessage("Product price is required")
    .isNumeric()
    .withMessage("Product price must be a number")
    .isLength({ min: 1 , max: 32})
    .withMessage("Product price must be between 1 and 32 characters long")
    .isFloat({ min: 1.0 })
    .withMessage("Product price must be greater than 1.0");

// @desc: Rule checks if product discounted price is provided, and is greater than 0
// @usage: use this Rule inside expressValidatorCallback utility function
module.exports.ProductDiscountedPriceRule = check("discountedPrice")
    .optional()
    .isNumeric()
    .withMessage("Product discounted price must be a number")
    .toFloat()
    .isFloat({ min: 1 })
    .withMessage("Product discounted price must be greater than 0")
    .custom(DiscountedPriceLessThanPrice);

// @desc: Rule checks if product colors is provided
// @usage: use this Rule inside expressValidatorCallback utility function
module.exports.ProductColorsRule = check("colors")
    .optional()
    .isArray()
    .withMessage("Product colors must be an array")
    .customSanitizer(notRedundant);

// @desc: Rule checks if product image cover is provided
// @usage: use this Rule inside expressValidatorCallback utility function
module.exports.ProductImageCoverRule = check("imageCover")
    .notEmpty()
    .withMessage("Product image cover is required");

// @desc: Rule checks if product images is provided
// @usage: use this Rule inside expressValidatorCallback utility function
module.exports.ProductImagesRule = check("images")
    .optional()
    .isArray()
    .withMessage("Product images must be an array")
    .customSanitizer(notRedundant);

// @desc: Rule checks if product category id is valid mongo id
// @usage: use this Rule inside expressValidatorCallback utility function
module.exports.ProductCategoryIdRule = check("category")
    .isMongoId()
    .withMessage("Invalid Category id format")
    .custom(categoryExists);

// @desc: Rule checks optionally if product category id is valid mongo id
// @usage: use this Rule inside expressValidatorCallback utility function
module.exports.OptionalProductCategoryIdRule = check("category")
    .optional()
    .isMongoId()
    .withMessage("Invalid Category id format")
    .custom(categoryExists);

// @desc: Rule checks if product subCategories id is valid mongo id
// @usage: use this Rule inside expressValidatorCallback utility function
module.exports.ProductSubcategoryIdRule = check("subCategories")
    .optional()
    .isArray()
    .withMessage("Product subcategory must be an array")
    .customSanitizer(notRedundant)
    .isMongoId()
    .withMessage("Invalid Subcategory id format")
    .custom(subCategoryExists)
    .custom(subCategoriesBelongToCategory);

// @desc: Rule checks if product brand id is valid mongo id
// @usage: use this Rule inside expressValidatorCallback utility function
module.exports.ProductBrandIdRule = check("brand")
    .optional()
    .isMongoId()
    .withMessage("Invalid Brand id format")
    .custom(brandExists);

// @desc: Rule checks if product ratingsAverage is provided
// @usage: use this Rule inside expressValidatorCallback utility function
module.exports.ProductRatingsAverageRule = check("ratingsAverage")
    .optional()
    .isNumeric()
    .withMessage("Product ratingsAverage must be a number")
    .toFloat()
    .isFloat({ min: 1, max: 5 })
    .withMessage("Product ratingsAverage must be between 1 and 5");

// @desc: Rule checks if product ratingsQuantity is provided
// @usage: use this Rule inside expressValidatorCallback utility function
module.exports.ProductRatingsQuantityRule = check("ratingsQuantity")
    .optional()
    .isNumeric()
    .withMessage("Product ratingsQuantity must be a number");

// @desc: Rule checks if product id is valid mongo id
// @usage: use this Rule inside expressValidatorCallback utility function
module.exports.ProductIdRule = check("id")
    .isMongoId()
    .withMessage("Invalid Product id format");