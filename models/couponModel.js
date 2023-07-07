const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, 'A coupon must have a name'],
        unique: [true, 'Coupon name must be unique'],
        lowercase: true,
    },
    expireAt: {
        type: Date,
        required: [true, 'A coupon must have an expire date'],
    },
    discount: {
        type: Number,
        required: [true, 'A coupon must have a discount'],
        min: [0, 'Discount must be at least 0'],
        max: [100, 'Discount must be at most 100'],
    }
},{timestamps: true});

module.exports = mongoose.model('coupons', couponSchema);