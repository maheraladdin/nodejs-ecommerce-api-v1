const expressValidatorCallback = require("../expressValidatorCallback");
const {ProductIdRule} = require("../ValidationRules/wishlistRules");

// @desc: Validator for adding product to wishlist
// @usage: use this validator in routes to validate category data
// @note: this validator should be placed before the controller
module.exports.addProductToWishlistValidator = expressValidatorCallback([ProductIdRule]);

// @desc: Validator for removing product from wishlist
// @usage: use this validator in routes to validate category data
// @note: this validator should be placed before the controller
module.exports.removeProductFromWishlistValidator = expressValidatorCallback([ProductIdRule]);