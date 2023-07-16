// Purpose: cart model schema

// require mongoose
const mongoose = require("mongoose");

/**
 * @desc    create cart schema using mongoose schema
 * @param   {object} cartSchema - cart schema object
 * @param   {object} cartSchema.items - cart items
 * @param   {object} cartSchema.items.product - cart item product
 * @param   {string} cartSchema.items.product.name - cart item product name
 * @param   {string} cartSchema.items.product.slug - cart item product slug
 * @param   {string} cartSchema.items.product.image - cart item product image
 * @param   {number} cartSchema.items.quantity - cart item quantity
 * @param   {number} cartSchema.items.price - cart item price
 * @param   {string} cartSchema.items.color - cart item color
 * @param   {number} cartSchema.totalCartPrice - cart total price
 * @param   {number} cartSchema.totalCartDiscountedPrice - cart total discounted price
 * @param   {object} cartSchema.user - cart user
 * @param   {object} cartSchema.coupon - cart coupon
 * @param   {object} cartSchema.timestamps - cart timestamps
 */
const cartSchema = new mongoose.Schema({
    items: [
        {
            product: {
                type: mongoose.Schema.ObjectId,
                ref: "products",
            },
            quantity: { type: Number, default: 1 },
            price: { type: Number, required: true },
            color: String
        }
    ],
    totalCartPrice: { type: Number, default: 0 },
    totalCartDiscountedPrice: { type: Number, default: 0 },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
    },
    coupon: {
        type: mongoose.Schema.ObjectId,
        ref: "Coupon",
    },
}, { timestamps: true });

/*
 * @desc    create model from schema
 * @param   {string} modelName - model name
 * @param   {object} cartSchema - cart schema
 */
module.exports = mongoose.model("Cart", cartSchema);