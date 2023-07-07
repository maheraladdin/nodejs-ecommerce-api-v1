const  {idRule} = require("./RulesFactory");
const {check} = require("express-validator");
const RequestError = require("../../RequestError");

const addressExistsHandler = async (value,{req}) => {
    const isProductExists = req.user.addresses.some(address => address._id.toString() === value);
    if (!isProductExists) {
        throw new RequestError("Product with provided id does not exist",404);
    }
    return true;
}

/*
 * @desc: Rule checks if address id is valid mongoose id
 */
module.exports.AddressIdRule = idRule("address", {field: "address"})
    .custom(addressExistsHandler);

/**
 * @desc: Rule checks if alias is unique
 * @param {string} value - alias
 * @param {object} req - request object
 * @return {boolean}
 */
const isAliasUniqueHandler = (value, {req}) => {
    const {addresses} = req.user;
    const isAliasUnique = addresses.every(address => address.alias !== value);
    if (!isAliasUnique) {
        throw new RequestError("Alias must be unique", 400);
    }
    return true;
}

/*
 * @desc: Rule checks if alias is valid
 */
module.exports.AddressAliasRule = check("alias")
    .trim()
    .notEmpty()
    .withMessage("Alias is required")
    .isLength({min: 3, max: 20})
    .withMessage("Alias must be between 3 and 20 characters")
    .custom(isAliasUniqueHandler);

/*
 * @desc: Rule checks if phone number is valid (egypt, saudi)
 */
module.exports.AddressPhoneRule = check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("Please provide a valid phone number from Egypt or Saudi Arabia");

/*
 * @desc: Rule checks if postal code is valid
 */
module.exports.AddressPostalCodeRule = check("postalCode")
    .optional()
    .isPostalCode("any")
    .withMessage("Please provide a valid postal code");




