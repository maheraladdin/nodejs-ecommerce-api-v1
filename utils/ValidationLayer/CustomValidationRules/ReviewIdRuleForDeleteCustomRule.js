const Review = require('../../../models/reviewModel');
const User = require('../../../models/userModel');
const RequestError = require('../../../utils/RequestError');

/**
 * @desc: Rule checks if the user role is admin or manager then he can delete any review otherwise he can delete only his own reviews
 * @param {string} value - review id
 * @param {object} req - request object
 * @return {Promise<boolean>}
 */
module.exports = async (value, {req}) => {
    // check if review exists
    const review = await Review.findById(value);
    if (!review) {
        throw new RequestError(`there is no review for id: ${value}`, 404);
    }
    // check if user is admin or manager then he can delete any review otherwise he can delete only his own reviews
    const user = await User.findById(req.user.id);
    if(user.role === 'user' && review.user.id.toString() !== req.user.id.toString()) {
        throw new RequestError('You are not allowed to delete this review', 403);
    }
    return true;
}