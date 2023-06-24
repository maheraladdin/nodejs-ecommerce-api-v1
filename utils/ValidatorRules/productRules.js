const {check} = require("express-validator");

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
    .custom((value, { req }) => {
        if (value > req.body.price) {
            throw new Error("Product discounted price must be less than product price");
        }
        return true;
    });

// @desc: Rule checks if product colors is provided
// @usage: use this Rule inside expressValidatorCallback utility function
module.exports.ProductColorsRule = check("colors")
    .optional()
    .isArray()
    .withMessage("Product colors must be an array");

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
    .withMessage("Product images must be an array");

// @desc: Rule checks if product category id is valid mongo id
// @usage: use this Rule inside expressValidatorCallback utility function
module.exports.ProductCategoryIdRule = check("category")
    .isMongoId()
    .withMessage("Invalid Category id format");

// @desc: Rule checks if product subcategory id is valid mongo id
// @usage: use this Rule inside expressValidatorCallback utility function
module.exports.ProductSubcategoryIdRule = check("subcategory")
    .optional()
    .isArray()
    .withMessage("Product subcategory must be an array")
    .isMongoId()
    .withMessage("Invalid Subcategory id format");

// @desc: Rule checks if product brand id is valid mongo id
// @usage: use this Rule inside expressValidatorCallback utility function
module.exports.ProductBrandIdRule = check("brand")
    .optional()
    .isMongoId()
    .withMessage("Invalid Brand id format");

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