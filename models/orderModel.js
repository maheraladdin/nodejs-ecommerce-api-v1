// Purpose: coupon model schema

// require mongoose
const mongoose = require('mongoose');

/**
 * @desc   create order schema using mongoose schema
 * @param  {object} orderSchema - order schema object
 * @param  {object} orderSchema.user - order user
 * @param  {object} orderSchema.items - order items
 * @param  {object} orderSchema.items.product - order item product
 * @param  {string} orderSchema.items.product.name - order item product name
 * @param  {string} orderSchema.items.product.slug - order item product slug
 * @param  {string} orderSchema.items.product.image - order item product image
 * @param  {number} orderSchema.items.quantity - order item quantity
 * @param  {number} orderSchema.items.price - order item price
 * @param  {string} orderSchema.items.color - order item color
 * @param  {number} orderSchema.tax - order tax
 * @param  {number} orderSchema.shipping - order shipping
 * @param  {number} orderSchema.total - order total
 * @param  {string} orderSchema.paymentMethod - order payment method
 * @param  {boolean} orderSchema.isPaid - order is paid
 * @param  {date} orderSchema.paidAt - order paid at
 * @param  {boolean} orderSchema.isDelivered - order is delivered
 * @param  {date} orderSchema.deliveredAt - order delivered at
 * @param  {object} orderSchema.shippingAddress - order shipping address
 * @param  {string} orderSchema.shippingAddress.alias - order shipping address alias
 * @param  {string} orderSchema.shippingAddress.details - order shipping address details
 * @param  {string} orderSchema.shippingAddress.phone - order shipping address phone
 * @param  {string} orderSchema.shippingAddress.city - order shipping address city
 * @param  {string} orderSchema.shippingAddress.postalCode - order shipping address postal code
 * @param  {boolean} orderSchema.isCancelled - order is cancelled
 * @param  {date} orderSchema.cancelledAt - order cancelled at
 * @param  {object} orderSchema.timestamps - order timestamps
 */
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
        enum: ["card", "cash"],
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

/**
 * @desc    Mongoose pre middleware to populate user and product
 * @param   {function} next - next middleware
 */
const populateUserAndProductHandler = function (next) {
    this
        .populate({path: 'user', select: 'name email phone profileImg'})
        .populate({path: 'items.product', select: 'title imageCover'});
    next();
}

orderSchema.pre(/^find/, populateUserAndProductHandler);

/*
 * @desc    create model from schema
 * @param   {string} modelName - model name
 * @param   {object} orderSchema - order schema
 */
module.exports = mongoose.model('orders', orderSchema);