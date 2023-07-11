const RequestError = require("../../requestError");

/**
 * @desc    Check if product discounted price is less than product price
 * @param   value
 * @param   req
 * @return  {boolean}
 */
module.exports = (value, { req }) => {
    if (value > req.body.price) {
        throw new RequestError("Product discounted price must be less than product price", 400);
    }
    return true;
}