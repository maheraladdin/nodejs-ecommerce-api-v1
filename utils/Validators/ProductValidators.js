const expressValidatorCallback = require("../expressValidatorCallback");
const {
    ProductNameRule,
    ProductDescriptionRule,
    ProductQuantityRule,
    ProductSoldRule,
    ProductPriceRule,
    ProductDiscountedPriceRule,
    ProductColorsRule,
    ProductImageCoverRule,
    ProductImagesRule,
    ProductCategoryIdRule,
    ProductSubcategoryIdRule,
    ProductBrandIdRule,
    ProductRatingsAverageRule,
    ProductRatingsQuantityRule,
    ProductIdRule
} = require("../ValidatorRules/productRules");

const categoryExists = require("../../middlewares/categoryExists");

// @desc: Validator for getting product by id from request params
// @usage: use this validator in routes to validate product id
// @note: this validator should be placed before the controller
module.exports.getProductByIdValidator = expressValidatorCallback([ProductIdRule]);

// @desc: Validator for creating product
// @usage: use this validator in routes to validate product data
// @note: this validator should be placed before the controller
module.exports.createProductValidator = expressValidatorCallback([
    ProductNameRule,
    ProductDescriptionRule,
    ProductQuantityRule,
    ProductSoldRule,
    ProductPriceRule,
    ProductDiscountedPriceRule,
    ProductColorsRule,
    ProductImageCoverRule,
    ProductImagesRule,
    ProductCategoryIdRule,
    ProductSubcategoryIdRule,
    ProductBrandIdRule,
    ProductRatingsAverageRule,
    ProductRatingsQuantityRule
],[categoryExists]);

// @desc: Validator for updating product
// @usage: use this validator in routes to validate product data
// @note: this validator should be placed before the controller
module.exports.updateProductValidator = expressValidatorCallback([ProductIdRule],[categoryExists]);

// @desc: Validator for deleting product
// @usage: use this validator in routes to validate product id
// @note: this validator should be placed before the controller
module.exports.deleteProductValidator = expressValidatorCallback([ProductIdRule]);
