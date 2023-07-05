const Review = require("../../../models/reviewModel");
const RequestError = require("../../RequestError");
const User = require("../../../models/UserModel");
const Product = require("../../../models/productModel");
module.exports = async (value, {req}) => {
    // check if user exists
    const isUserExists = await User.exists({_id: value});
    if (!isUserExists) {
        throw new RequestError(`User not found for id: ${value}`, 404);
    }

    // check if product exists
    const isProductExists = await Product.exists({_id: req.body.product});
    if (!isProductExists) {
        throw new RequestError(`Product not found for id: ${req.body.product}`, 404);
    }

    // check if user is trying to review by his user id
    if (value !== req.user.id) {
        throw new RequestError("User can only review by his user id", 400);
    }

    // check if user already reviewed this product
    const stateOfReviewable = await Review.findOne({user: value, product: req.body.product});
    if (stateOfReviewable) {
        throw new RequestError("User can only review once per product", 400);
    }

    return true;
}