// Purpose: coupon model schema

// require mongoose
const mongoose = require('mongoose');

/**
 * @desc   create coupon schema using mongoose schema
 * @param  {object} couponSchema - coupon schema object
 * @param  {string} couponSchema.name - coupon name
 * @param  {date} couponSchema.expireAt - coupon expire date
 * @param  {number} couponSchema.discount - coupon discount
 * @param  {number} couponSchema.maxDiscount - coupon max discount
 * @param  {number} couponSchema.numberOfUsage - coupon number of usage
 * @param  {number} couponSchema.maxNumberOfUsage - coupon max number of usage
 * @param  {object} couponSchema.timestamps - coupon timestamps
 */
const couponSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, 'A coupon must have a name'],
        unique: [true, 'Coupon name must be unique'],
        lowercase: true,
        minlength: [3, 'Coupon name must be at least 3 characters'],
        maxlength: [50, 'Coupon name must be at most 50 characters'],
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
    },
    maxDiscount: {
        type: Number,
        min: [1, 'Max discount must be at least 1'],
    },
    numberOfUsage: {
        type: Number,
        default: 0,
        min: [0, 'Number of usage must be at least 0'],
    },
    maxNumberOfUsage: {
        type: Number,
        default: 1,
        min: [1, 'Max number of usage must be at least 1'],
    }
},{timestamps: true});

/*
 * @desc    create model from schema
 * @param   {string} modelName - model name
 * @param   {object} couponSchema - coupon schema
 */
module.exports = mongoose.model('coupons', couponSchema);