// import mongoose
const mongoose = require('mongoose');

// (1) create schema
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

// (2) create models
module.exports = mongoose.model('brands', brandSchema);