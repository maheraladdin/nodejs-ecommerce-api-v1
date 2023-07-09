
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Order must belong to a user']
    },
    items: [
        {
            product: {
                type: mongoose.Schema.ObjectId,
                ref: "products",
            },
            quantity: Number,
            price: { type: Number, required: true },
            color: String
        }
    ],
    tax: {type: Number, default: 0},
    shipping: {type: Number, default: 0},
    total: {type: Number, default: 0},
    paymentMethod: {
        type: String,
        required: [true, 'Order must have a payment intent'],
        enum: ["card", "cash", "paypal"],
        default: "cash",
    },
    isPaid: {
        type: Boolean,
        default: false,
    },
    paidAt: Date,
    isDelivered: {
        type: Boolean,
        default: false,
    },
    deliveredAt: Date,
    shippingAddress: {
        alias: {
            type: String,
            required: [true, 'An address must have an alias'],
            trim: true,
            minLength: [3, 'Alias must be at least 3 characters'],
            maxLength: [20, 'Alias must be at most 20 characters']
        },
        details: String,
        phone: String,
        city: String,
        postalCode: String,
    },
    isCancelled: {
        type: Boolean,
        default: false,
    },
    cancelledAt: Date,
},{timestamps: true});

module.exports = mongoose.model('orders', orderSchema);