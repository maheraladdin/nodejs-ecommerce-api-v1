const {check} = require("express-validator");

/**
 * @desc: Rule checks if name or title is provided, and is between 3 and 50 characters long
 * @param {string} doc - document name
 * @param {object?} options - options object
 * @param {number?} options.min - minimum length of name or title
 * @param {number?} options.max - maximum length of name or title
 * @param {boolean?} options.optional - if true, name or title is optional
 * @param {string?} options.field - field name
 * @returns {function}
 */
module.exports.optionalRequireLengthRule = (doc,options) => {

    const min = options && options.min || 3;
    const max = options && options.max || 50;
    const requireErrorMsg = `${doc} name is required`;
    const lengthErrorMsg = `${doc} name must be between ${min} and ${max} characters long`;
    const field = options && options.field || "name";

    // build validation chain
    const chain = check(field);
    options && options.optional && chain.optional();

    return chain
        .trim()
        .notEmpty()
        .withMessage(requireErrorMsg)
        .isLength({min, max})
        .withMessage(lengthErrorMsg);
}

/**
 * @desc: Rule checks if id is valid mongo id
 * @param {string} doc - document name
 * @param {object?} options - options object
 * @param {string?} options.field - field name
 * @param {boolean?} options.optional - if true, id is optional
 */
module.exports.idRule = (doc,options) => {

    const field = options && options.field || "id";
    const mongoIdErrorMsg = `Invalid ${doc} id format`;

    // build validation chain
    const chain = check(field);
    options && options.optional && chain.optional();

    return chain
        .isMongoId()
        .withMessage(mongoIdErrorMsg);
}