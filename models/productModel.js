// require mongoose
const mongoose = require('mongoose');
// create Schema
const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Title is required"],
        trim: true,
        minlength: [3, "Title must be at least 3 characters long"],
        maxlength: [100, "Title must be less than 100 characters long"],
    },
    slug: {
        type: String,
        required: [true, "Slug is required"],
        lowercase: true,
    },
    description: {
        type: String,
        required: [true, "Description is required"],
        trim: true,
        minlength: [20, "Description must be at least 20 characters long"],
        maxlength: [5000, "Description must be less than 5000 characters long"],
    },
    quantity: {
        type: Number,
        required: [true, "Quantity is required"],
        min: [1, "Quantity must be at least 1"]
    },
    sold: {
        type: Number,
        default: 0,
    },
    price: {
        type: Number,
        required: [true, "Price is required"],
        trim: true,
        maxlength: [20, "Price must be less than 20 characters long"],
    },
    discountedPrice: {
        type: Number,
    },
    colors: [String],
    images: [String],
    imageCover: {
        type: String,
        required: [true, "Image cover is required"],
    },
    category: {
        type: mongoose.Schema.ObjectId,
        ref: "categories",
        required: [true, "Product must belong to a category"],
    },
    subcategory: [{
        type: mongoose.Schema.ObjectId,
        ref: "subCategories"
    }],
    brand: {
        type: mongoose.Schema.ObjectId,
        ref: "brands",
    },
    ratingsAverage: {
        type: Number,
        default: 0,
        min: [1, "Rating must be at least 1.0"],
        max: [5, "Rating must be at most 5.0"]
    },
    ratingsQuantity: {
        type: Number,
        default: 0,
    }
}, {timestamps: true});

// create model
module.exports = mongoose.model("products", productSchema);