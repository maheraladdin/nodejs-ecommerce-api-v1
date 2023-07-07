const expressValidatorCallback = require("../expressValidatorCallback");
const { CouponIdRule, CouponNameRule, discountRule, expireAtRule, optionalCouponNameRule, optionalDiscountRule, optionalExpireAtRule } = require("../ValidationRules/couponRules");

// @desc: Validator for getting category by id from request params
// @usage: use this validator in routes to validate category id
// @note: this validator should be placed before the controller
module.exports.getCouponByIdValidator = expressValidatorCallback([CouponIdRule]);

// @desc: Validator for creating category
// @usage: use this validator in routes to validate category data
// @note: this validator should be placed before the controller
module.exports.createCouponValidator = expressValidatorCallback([CouponNameRule, expireAtRule, discountRule]);

// @desc: Validator for updating category
// @usage: use this validator in routes to validate category data
// @note: this validator should be placed before the controller
module.exports.updateCouponValidator = expressValidatorCallback([CouponIdRule, optionalCouponNameRule, optionalExpireAtRule, optionalDiscountRule]);

// @desc: Validator for deleting category
// @usage: use this validator in routes to validate category id
// @note: this validator should be placed before the controller
module.exports.deleteCouponValidator = expressValidatorCallback([CouponIdRule]);