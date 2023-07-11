const {check} = require('express-validator');
const Product = require('../../../models/productModel');
const Coupon = require('../../../models/couponModel');
const { idRule } = require('./RulesFactory');
const RequestError = require('../../requestError');


/**
 * @desc: Validator for validating product id
 * @param {string} productId - product id
 * @return {Promise<boolean>}
 */
const isProductExists = async (productId) => {
    const product = await Product.findById(productId);
    if (!product) {
        throw new RequestError("Product not found", 404);
    }
    return true;
}

// @desc: Validator for validating product id
// @usage: use this validator in routes to validate product id
// @note: this validator should be placed before the controller
module.exports.ProductIdRule = check("product")
    .trim()
    .notEmpty()
    .withMessage("Product id is required")
    .isMongoId()
    .withMessage("Invalid product id")
    .custom(isProductExists);

const isColorExistsInProductColors = async (color, {req}) => {
    const {colors} = await Product.findById(req.body.product);
    if (!colors.includes(color)) {
        throw new RequestError("Color not found", 404);
    }
    return true;
}

// @desc: Validator for validating color
// @usage: use this validator in routes to validate color
// @note: this validator should be placed before the controller
module.exports.ColorRule = check("color")
    .optional()
    .trim()
    .isString()
    .withMessage("Color must be a string")
    .custom(isColorExistsInProductColors);

// @desc: Validator for validating quantity
// @usage: use this validator in routes to validate quantity
// @note: this validator should be placed before the controller
module.exports.QuantityRule = check("quantity")
    .trim()
    .notEmpty()
    .withMessage("Quantity is required")
    .isInt({ min: 1 })
    .withMessage("Quantity must be a positive integer");

// @desc: Validator for validating id
// @usage: use this validator in routes to validate id
// @note: this validator should be placed before the controller
module.exports.IdRule = idRule("item");

/**
 * @desc:   middleware for checking if coupon exists
 * @param   {string} name - coupon name
 * @return  {Promise<boolean>}
 */
const isCouponExists = async (name) => {
    const coupon = await Coupon.findOne({name});
    if (!coupon) {
        throw new RequestError("Coupon not found", 404);
    }
    return true;
}

// @desc: Validator for validating coupon name
// @usage: use this validator in routes to validate coupon name
// @note: this validator should be placed before the controller
module.exports.CouponNameRule = check("name")
    .trim()
    .notEmpty()
    .withMessage("Coupon name is required")
    .isString()
    .withMessage("Coupon name must be a string")
    .isLength({ min: 3, max: 50 })
    .withMessage("Coupon name must be between 3 and 50 characters long")
    .toLowerCase()
    .custom(isCouponExists);









