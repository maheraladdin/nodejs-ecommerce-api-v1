const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    ratings: {
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

module.exports = mongoose.model('Review', reviewSchema);