const expressValidatorCallback = require("../expressValidatorCallback");
const {ProductIdRule, ColorRule, CouponNameRule, QuantityRule, IdRule} = require("../ValidationRules/cartRules");

// @desc:   Validator for adding item to cart
// @usage:  use this validator in routes to validate cart item data
// @note:   this validator should be placed before the controller
module.exports.addItemToCartValidator = expressValidatorCallback([ProductIdRule, ColorRule]);

// @desc:   Validator for updating item quantity
// @usage:  use this validator in routes to validate cart item data
// @note:   this validator should be placed before the controller
module.exports.updateItemQuantityValidator = expressValidatorCallback([IdRule, QuantityRule]);

// @desc:   Validator for applying coupon
// @usage:  use this validator in routes to validate coupon name
// @note:   this validator should be placed before the controller
module.exports.applyCouponValidator = expressValidatorCallback([CouponNameRule]);

// @desc:   Validator for delete item by id
// @usage:  use this validator in routes to validate item id to be deleted
// @note:   this validator should be placed before the controller
module.exports.deleteItemFromCartValidator = expressValidatorCallback([IdRule])
