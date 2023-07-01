const RequestError = require('../../RequestError');

/**
 * @desc: Rule checks if password and passwordConfirmation are the same
 * @param {string} password - User password
 * @param {object} req - req object
 * @param {object} req.body - req.body object
 * @param {string} req.body.passwordConfirmation - User password confirmation
 * @return {boolean}
 */
module.exports = (password, {req}) => {
    if (password !== req.body.passwordConfirmation) throw new RequestError("Password don't match password confirmation", 400);
    return true;
}