const expressValidatorCallback = require("../../expressValidatorCallback");
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
    OptionalProductCategoryIdRule,
    ProductSubcategoryIdRule,
    ProductBrandIdRule,
    ProductRatingsAverageRule,
    ProductRatingsQuantityRule,
    ProductIdRule
} = require("../ValidationRules/productRules");

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
]);

// @desc: Validator for updating product
// @usage: use this validator in routes to validate product data
// @note: this validator should be placed before the controller
module.exports.updateProductValidator = expressValidatorCallback([ProductIdRule, OptionalProductCategoryIdRule]);

// @desc: Validator for deleting product
// @usage: use this validator in routes to validate product id
// @note: this validator should be placed before the controller
module.exports.deleteProductValidator = expressValidatorCallback([ProductIdRule]);
