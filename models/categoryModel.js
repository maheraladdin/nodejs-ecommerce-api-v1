const mongoose = require('mongoose');

/**
 * @desc    category schema
 */
const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Category name is required'],
        unique: [true, 'Category name must be unique'],
        minlength: [3, 'Category name must be at least 3 characters long'],
        maxlength: [50, 'Category name must not be more than 50 characters long'],
        trim: true
    },
    slug: {
        type: String,
        lowercase: true,

    },
    image: String
},{
    timestamps: true
});

/**
 * @desc    mongoose post middleware to add image url to response
 */
categorySchema.post(/(init|save)/, function (doc) {
    if(doc.image) doc.image = `${process.env.HOST}/categories/${doc.image}`;
});

/**
 * @desc    create model from schema
 */
module.exports = mongoose.model('categories', categorySchema);