const RequestError = require("../../RequestError");

module.exports = (value, { req }) => {
    if (value > req.body.price) {
        throw new RequestError("Product discounted price must be less than product price", 400);
    }
    return true;
}