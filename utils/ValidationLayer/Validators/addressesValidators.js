const expressValidatorCallback = require("../expressValidatorCallback");
const {AddressIdRule, AddressAliasRule, AddressPhoneRule, AddressPostalCodeRule} = require("../ValidationRules/addressesRules");

// @desc: Validator for adding Address to wishlist
// @usage: use this validator in routes to validate category data
// @note: this validator should be placed before the controller
module.exports.addAddressToAddressesValidator = expressValidatorCallback([AddressAliasRule, AddressPhoneRule, AddressPostalCodeRule]);

// @desc: Validator for removing Address from wishlist
// @usage: use this validator in routes to validate category data
// @note: this validator should be placed before the controller
module.exports.removeAddressFromAddressesValidator = expressValidatorCallback([AddressIdRule]);