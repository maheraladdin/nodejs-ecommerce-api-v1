const requestError = require("../../requestError");

module.exports = (value, { req }) => {
    if (value > req.body.price) {
        throw new requestError("Product discounted price must be less than product price", 400);
    }
    return true;
}