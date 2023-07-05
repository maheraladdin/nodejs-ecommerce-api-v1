const Review = require('../../../models/reviewModel');
const User = require('../../../models/UserModel');
const RequestError = require('../../../utils/RequestError');

/**
 * @desc: Rule checks if the user role is admin or manager then he can delete any review otherwise he can delete only his own reviews
 * @param {string} value - review id
 * @param {object} req - request object
 * @return {Promise<boolean>}
 */
module.exports = async (value, {req}) => {
    const review = await Review.findById(value);
    if (!review) {
        throw new RequestError('Review not found', 404);
    }
    const user = await User.findById(req.user.id);
    if (!user) {
        throw new RequestError('User not found', 404);
    }
    if(user.role === 'user' && review.user.toString() !== req.user.id) {
        throw new RequestError('You are not allowed to delete this review', 403);
    }
    return true;
}