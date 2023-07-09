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
        min: [0, "product out of stock"],
    },
    sold: {
        type: Number,
        default: 0,
    },
    price: {
        type: Number,
        required: [true, "Price is required"],
        trim: true,
        min: [1, "Price must be at least 1"],
        minlength: [1, "Price must be at least 1 character long"],
        maxLength: [32, "Price must be less than 32 characters long"],
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
    subCategories: [{
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
}, {
    timestamps: true ,
    // to enable virtual populate
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
});

// create virtual property
productSchema.virtual("reviews", {
    ref: "Review",
    foreignField: "product",
    localField: "_id",
});

/**
 * @desc    mongoose pre middleware to populate category
 * @param   {Function} next - next middleware
 */
const populateCategories = function (next) {
    this.populate({
        path: "category",
        select: "name -_id",
    });
    next();
}

productSchema.pre(/^find/, populateCategories);

/**
 * @desc    mongoose post middleware to add initiate base64 to imageCover and images
 * @param   {Object} doc - document object
 * @param   {string} doc.imageCover - imageCover url
 * @param   {string[]} doc.images - images url
 * @return  {void}
 */
const setInitiateBase64 = function (doc) {
    const initiateBase64 = "data:image/webp;base64,";
    if(doc.imageCover && !doc.imageCover.startsWith("http")) doc.imageCover = initiateBase64 + doc.imageCover;
    if(doc.images) doc.images = doc.images.map(image => (!image.startsWith("http")) ? initiateBase64 + image : image);
}

productSchema.post(/(init|save)/, setInitiateBase64);

// create model
module.exports = mongoose.model("products", productSchema);