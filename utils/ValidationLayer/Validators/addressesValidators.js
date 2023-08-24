const expressValidatorCallback = require("../expressValidatorCallback");
const {AddressIdRule, AddressAliasRule, OptionalAddressAliasRule, AddressPhoneRule, AddressPostalCodeRule} = require("../ValidationRules/addressesRules");

// @desc: Validator for getting user address by id
// @usage: use this validator in routes to validate address id
// @note: this validator should be placed before the controller
module.exports.getUserAddressByIdValidator = expressValidatorCallback([AddressIdRule]);

// @desc: Validator for adding Address to wishlist
// @usage: use this validator in routes to validate address data
// @note: this validator should be placed before the controller
module.exports.addAddressToAddressesValidator = expressValidatorCallback([AddressAliasRule, AddressPhoneRule, AddressPostalCodeRule]);

// @desc: Validator for removing Address from wishlist
// @usage: use this validator in routes to validate address data
// @note: this validator should be placed before the controller
module.exports.removeAddressFromAddressesValidator = expressValidatorCallback([AddressIdRule]);

// @desc: Validator for updating Address in wishlist
// @usage: use this validator in routes to validate address data
// @note: this validator should be placed before the controller
module.exports.updateAddressInAddressesValidator = expressValidatorCallback([AddressIdRule, OptionalAddressAliasRule, AddressPhoneRule, AddressPostalCodeRule]);