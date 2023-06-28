const mongoose = require('mongoose');

/**
 * @desc    brand schema
 */
const brandSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'brand name is required'],
        unique: [true, 'brand name must be unique'],
        minlength: [3, 'brand name must be at least 3 characters long'],
        maxlength: [50, 'brand name must not be more than 50 characters long'],
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
brandSchema.post(/(init|save)/, function (doc) {
    const initiateBase64 = "data:image/webp;base64,";
    if(doc.image) doc.image = initiateBase64 + doc.image;
});

/**
 * @desc    create model from schema
 */
module.exports = mongoose.model('brands', brandSchema);