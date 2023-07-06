// Description: Handle review requests.
const {deleteOne, getAll, getOne, updateOne, createOne} = require("./handlersFactory");
const Review = require("../models/reviewModel");

/*
 * @route   GET /api/v1/reviews
 * @desc    Get all reviews
 * @access  Public
 */
module.exports.getReviews = getAll(Review, 'Review',{nested: true});

/*
 * @route   GET /api/v1/reviews/:id
 * @desc    Get a review by id
 * @access  Public
 */
module.exports.getReviewById = getOne(Review,'Review');

/*
 * @route   POST /api/v1/reviews
 * @desc    Create a new review
 * @access  Private (user)
 */
module.exports.createReview = createOne(Review);

/*
 * @route   PUT /api/v1/reviews/:id
 * @desc    Update a review by id
 * @access  Private (user)
 */
module.exports.updateReviewById = updateOne(Review, "Review",{deleteFromRequestBody: ["user", "product"]});

/*
 * @route   DELETE /api/v1/reviews/:id
 * @desc    Delete a review by id
 * @access  Protected (user, admin, manager )
 */
module.exports.deleteReviewById = deleteOne(Review, "Review");