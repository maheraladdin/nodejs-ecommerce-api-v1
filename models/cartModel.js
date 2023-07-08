
const mongoose = require("mongoose");

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
    }
}, { timestamps: true });

module.exports = mongoose.model("Cart", cartSchema);