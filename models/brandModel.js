const mongoose = require('mongoose');

/**
 * @desc    create brand schema using mongoose schema
 * @param   {object} brandSchema - brand schema object
 * @param   {string} brandSchema.name - brand name
 * @param   {string} brandSchema.slug - brand slug
 * @param   {string} brandSchema.image - brand image
 * @param   {object} brandSchema.timestamps - brand timestamps
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
 * @desc    Mongoose post middleware to add initiateBase64 to image
 * @param   {object} doc - document object
 * @param   {string} doc.image - Category image
 */
const setInitiateBase64 = function (doc) {
    const initiateBase64 = "data:image/webp;base64,";
    if(doc.image) doc.image = initiateBase64 + doc.image;
}

brandSchema.post(/(init|save)/, setInitiateBase64);

/*
 * @desc    create model from schema
 * @param   {string} modelName - model name
 * @param   {object} brandSchema - brand schema
 */
module.exports = mongoose.model('brands', brandSchema);