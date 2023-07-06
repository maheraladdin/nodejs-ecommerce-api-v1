
const Review = require('../../../models/reviewModel');
const RequestError = require('../../../utils/RequestError');


/**
 * @desc: Rule checks if review owner is the same as the user who is trying to update the review
 * @param {string} value - review id
 * @param {object} req - request object
 * @param {object} req.user - user object
 * @param {string} req.user._id - user id
 * @return {Promise<boolean>}
 */
module.exports = async (value, {req}) => {
    const review = await Review.findById(value);
    if (!review) {
        throw new RequestError('Review not found for id: ' + value, 404);
    }

    if (review.user._id.toString()  !== req.user._id.toString()) {
        throw new RequestError('only the owner of this review can update it', 403);
    }
    return true;
}