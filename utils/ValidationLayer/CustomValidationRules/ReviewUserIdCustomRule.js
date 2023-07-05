const Review = require("../../../models/reviewModel");
const RequestError = require("../../RequestError");
module.exports = async (value, {req}) => {
    if (value !== req.user.id) {
        throw new RequestError("User can only review by his user id", 400);
    }
    const stateOfReviewable = await Review.findOne({user: value, product: req.body.product});
    if (stateOfReviewable) {
        throw new RequestError("User can only review once per product", 400);
    }
    return true;
}