// Purpose: category model schema

// require mongoose
const mongoose = require('mongoose');

/**
 * @desc   create category schema using mongoose schema
 * @param  {object} categorySchema - category schema object
 * @param  {string} categorySchema.name - category name
 * @param  {string} categorySchema.slug - category slug
 * @param  {string} categorySchema.image - category image
 * @param  {object} categorySchema.timestamps - category timestamps
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
 * @desc    Mongoose post middleware to add initiateBase64 to image
 * @param   {object} doc - document object
 * @param   {string} doc.image - Category image
 */
const setInitiateBase64 = function (doc) {
    const initiateBase64 = "data:image/webp;base64,";
    if(doc.image) doc.image = initiateBase64 + doc.image;
}

categorySchema.post(/(init|save)/, setInitiateBase64);

/*
 * @desc    create model from schema
 * @param   {string} modelName - model name
 * @param   {object} categorySchema - category schema
 */
module.exports = mongoose.model('categories', categorySchema);