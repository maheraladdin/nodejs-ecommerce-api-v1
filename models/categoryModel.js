// import mongoose
const mongoose = require('mongoose');

// (1) create schema
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

// (2) create models
module.exports = mongoose.model('categories', categorySchema);