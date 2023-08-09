const {check} = require("express-validator");
const categoryExists = require("../CustomValidationRules/categoryExists");
const DiscountedPriceLessThanPrice = require("../CustomValidationRules/DiscountedPriceLessThanPrice");
const subCategoryExists = require("../CustomValidationRules/subCategoryExists");
const brandExists = require("../CustomValidationRules/brandExists");
const notRedundant = require("../CustomValidationRules/notRedundant");
const subCategoriesBelongToCategory = require("../CustomValidationRules/subCategoriesBelongToCategory");
const {optionalRequireLengthRule, idRule} = require("./RulesFactory");

const optional = true;

// Product Error Messages

/**
 * @desc: error message for required fields
 * @param field
 * @return {`Product ${string} is required`}
 */
const requiredErrorMessage = (field) => `Product ${field} is required`;

/**
 * @desc: error message for numeric fields
 * @param field
 * @return {`Product ${string} must be a number`}
 */
const isNumericErrorMessage = (field) => `Product ${field} must be a number`;


/**
 * @desc: Rule checks if product title is provided, and is between 3 and 100 characters long
 */
module.exports.ProductNameRule = optionalRequireLengthRule("Product",{max: 100, field: "title"});

/**
 * @desc: Rule checks if product description is provided, and is between 20 and 5000 characters long
 */
module.exports.ProductDescriptionRule = optionalRequireLengthRule("Product",{min: 20, max: 5000, field: "description"});

const quantity = "quantity";
/**
 * @desc: Rule checks if quantity is provided, is number, and minimum quantity is 1
 */
module.exports.ProductQuantityRule = check(quantity)
    .notEmpty()
    .withMessage(requiredErrorMessage(quantity))
    .isNumeric()
    .withMessage(isNumericErrorMessage(quantity))
    .isInt({ min: 1 })
    .withMessage(`Product ${quantity} must be greater than 0`);

const sold = "sold";
/**
 * @desc: Rule checks if product sold is provided and is number
 */
module.exports.ProductSoldRule = check(sold)
    .optional()
    .isNumeric()
    .withMessage(isNumericErrorMessage(sold));

const price = "price";
/**
 * @desc: Rule checks if product price is provided, is number, is Length between 1 and 32, turn it to flout, and minimum value is 1.0
 */
module.exports.ProductPriceRule = check(price)
    .notEmpty()
    .withMessage(requiredErrorMessage(price))
    .isNumeric()
    .withMessage(isNumericErrorMessage(price))
    .isLength({ min: 1 , max: 32})
    .withMessage(`Product ${price} must be between 1 and 32 characters long`)
    .toFloat()
    .isFloat({ min: 1.0 })
    .withMessage(`Product ${price} must be greater than 1.0`);

const discountedPrice = "discountedPrice";
/**
 * @desc: Rule checks if product discounted price is provided, is number, turn it into float, and minimum value is 1.0
 */
module.exports.ProductDiscountedPriceRule = check(discountedPrice)
    .optional()
    .isNumeric()
    .withMessage(isNumericErrorMessage(discountedPrice))
    .toFloat()
    .isFloat({ min: 1.0 })
    .withMessage(`Product ${discountedPrice} must be greater than 0`)
    .custom(DiscountedPriceLessThanPrice);

const colors = "colors";
/**
 * @desc: Rule checks if product colors is provided , is array, and is not redundant
 */
module.exports.ProductColorsRule = check(colors)
    .optional()
    .isArray()
    .withMessage(`Product ${colors} must be an array`)
    .customSanitizer(notRedundant);

const imageCover = "imageCover";
/**
 * // @desc: Rule checks if product image cover is provided
 */
module.exports.ProductImageCoverRule = check(imageCover)
    .notEmpty()
    .withMessage(requiredErrorMessage(imageCover));

const images = "images";
/**
 * @desc: Rule checks optionally if product images is array, and is not redundant
 */
module.exports.ProductImagesRule = check(images)
    .optional()
    .customSanitizer(notRedundant);

/**
 * @desc: Rule checks if product category id is valid mongo id and exists in database
 */
module.exports.ProductCategoryIdRule = idRule("Category", {field: "category"})
    .custom(categoryExists);

/**
 * @desc: Rule checks optionally if product category id is valid mongo id and exists in database
 */
module.exports.OptionalProductCategoryIdRule = idRule("Category", {optional, field: "category"})
    .custom(categoryExists);

const subCategories = "subCategories";
/**
 * @desc: Rule checks optionally if product subCategories is array, is not redundant, is valid mongo id, exists in database, and belongs to category
 */
module.exports.ProductSubcategoryIdRule = check(subCategories)
    .optional()
    .isArray()
    .withMessage(`Product ${subCategories} must be an array`)
    .customSanitizer(notRedundant)
    .isMongoId()
    .withMessage(`Invalid ${subCategories} id format`)
    .custom(subCategoryExists)
    .custom(subCategoriesBelongToCategory);

/**
 * @desc: Rule checks optionally if product brand id is valid mongo id and exists in database
 */
module.exports.ProductBrandIdRule = idRule("Brand", {field: "brand",optional})
    .custom(brandExists);

const ratingsAverage = "ratingsAverage";
/**
 * @desc: Rule checks optionally if product ratingsAverage is number, turn it into float, and is between 1 and 5
 */
module.exports.ProductRatingsAverageRule = check(ratingsAverage)
    .optional()
    .isNumeric()
    .withMessage(isNumericErrorMessage(ratingsAverage))
    .toFloat()
    .isFloat({ min: 1, max: 5 })
    .withMessage(`Product ${ratingsAverage} must be between 1 and 5`);

const ratingsQuantity = "ratingsQuantity";
/**
 * @desc: Rule checks optionally if product ratingsQuantity is number
 */
module.exports.ProductRatingsQuantityRule = check(ratingsQuantity)
    .optional()
    .isNumeric()
    .withMessage(isNumericErrorMessage(ratingsQuantity));

/**
 * @desc: Rule checks if product id is valid mongo id
 */
module.exports.ProductIdRule = idRule("Product");