// Purpose: Review model for the database

// require mongoose
const mongoose = require('mongoose');

// require product model
const Product = require('./productModel');

/**
 * @desc    create review schema using mongoose schema
 * @param   {object} reviewSchema - review schema object
 * @param   {number} reviewSchema.rating - review rating
 * @param   {string} reviewSchema.comment - review comment
 * @param   {object} reviewSchema.user - review user
 * @param   {object} reviewSchema.product - review product
 * @param   {object} reviewSchema.timestamps - review timestamps
 */
const reviewSchema = new mongoose.Schema({
    rating: {
        type: Number,
        min: [1, 'Rating must be at least 1'],
        max: [5, 'Rating must can not be more than 5'],
        required: [true, 'Please add a rating between 1 and 5']
    },
    comment: {
        type: String,
        trim: true,
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Review must belong to a user']
    },
    product: {
        type: mongoose.Schema.ObjectId,
        ref: 'products',
        required: [true, 'Review must belong to a product']
    }
},{timestamps: true});

/**
 * @desc    mongoose middleware to populate user
 * @param   {function} next - next middleware
 */
const populateUserHandler = function (next) {
    this.populate({
        path: 'user',
        select: 'name profileImg'
    });
    next();
}

reviewSchema.pre(/^find/, populateUserHandler);

/**
 * @desc    mongoose static method to calculate average ratings and quantity of ratings
 * @param   {String} productId - product id
 * @return  {Promise<*>}
 */
reviewSchema.statics.calcAverageRatings = async function (productId) {
    return await this.aggregate([
        {
            // select all reviews that match the product id
            $match: {product: productId}
        },
        {
            // group by product id and calculate average ratings and quantity of ratings
            $group: {
                _id: '$product',
                ratingsQuantity: {$sum: 1},
                ratingsAverage: {$avg: '$rating'}
            }
        }]);
}

/**
 * @desc    mongoose post middleware to update average ratings and quantity of ratings after save in Product model
 * @return  {Promise<void>}
 */
const updateAverageRatings = async function () {
    const results = await this.constructor.calcAverageRatings(this.product);
    const [{ratingsQuantity, ratingsAverage}] = results.length ? results : [{ratingsQuantity: 0, ratingsAverage: 0}];
    await Product.findByIdAndUpdate(this.product, {ratingsQuantity, ratingsAverage});
}

reviewSchema.post(/(init|save)/, updateAverageRatings);

/*
 * @desc    create review model using mongoose model
 * @param   {string} reviews - review model in db
 * @param   {object} reviewSchema - review schema
 */
module.exports = mongoose.model('Review', reviewSchema);