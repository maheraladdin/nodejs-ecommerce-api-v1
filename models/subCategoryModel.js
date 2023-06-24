
const mongoose = require('mongoose');

const subCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        unique: [true, 'Sub category name must be unique'],
        required: [true, 'Sub category name is required'],
        minlength: [3, 'Sub category name must be at least 3 characters long'],
        maxlength: [50, 'Sub category name must not be more than 50 characters long']
    },
    slug: {
        type: String,
        lowercase: true
    },
    category: {
        type: mongoose.Schema.ObjectId,
        ref: 'categories',
        required: [true, 'Parent category is required']
    }
},{
    timestamps: true
});

module.exports = mongoose.model('subCategories', subCategorySchema);