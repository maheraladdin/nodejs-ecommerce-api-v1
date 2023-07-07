const mongoose = require('mongoose');
const Product = require('./productModel');

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

// populate username and user profileImg
reviewSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'user',
        select: 'name profileImg'
    });
    next();
});

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

module.exports = mongoose.model('Review', reviewSchema);