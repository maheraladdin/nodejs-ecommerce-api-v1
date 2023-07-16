// Purpose: To define the sub category model for the database

// require mongoose
const mongoose = require('mongoose');

/**
 * @desc   create sub category schema using mongoose schema
 * @param  {object} subCategorySchema - sub category schema object
 * @param  {string} subCategorySchema.name - sub category name
 * @param  {string} subCategorySchema.slug - sub category slug
 * @param  {object} subCategorySchema.category - sub category belongs to category
 * @param  {object} subCategorySchema.timestamps - sub category timestamps
 */
const subCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        unique: [true, 'Sub category name must be unique'],
        required: [true, 'Sub category name is required'],
        minlength: [2, 'Sub category name must be at least 2 characters long'],
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


/*
 * @desc    create model from schema
 * @param   {string} subCategories - model name
 * @param   {object} subCategorySchema - sub category schema
 */
module.exports = mongoose.model('subCategories', subCategorySchema);