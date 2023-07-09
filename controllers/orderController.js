
const asyncHandler = require('express-async-handler');
const Order = require('../models/orderModel');
const Cart = require('../models/cartModel');
const Product = require('../models/productModel');
const Coupon = require('../models/couponModel');
const User = require('../models/UserModel');
const RequestError = require('../utils/requestError');


/**
 * @desc    Create a new order with cash payment method (Cash on delivery)
 * @param   {Object} req - request object
 * @param   {Object} req.body - request body
 * @param   {String} req.body.shippingAddress - order shipping address alias
 * @param   {String} req.params - request params
 * @param   {String} req.params.id - cart id
 * @param   {Object} res - response object
 * @param   {Function} next - next middleware
 * @return {Promise<*>}
 */
const createCashOrderHandler = async (req, res, next) => {
    // app settings
    const tax = 0;
    const shipping = 0;
    // Get cart by id
    const cart = await Cart.findById(req.params.id);

    if (!cart) {
        return next(new RequestError('No cart found with that id', 404));
    }

    // Check if cart belongs to user
    if (cart.user.toString() !== req.user._id.toString()) {
        return next(new RequestError('Not authorized to access this cart', 401));
    }

    // Check if cart is empty
    if (cart.items.length === 0) {
        return next(new RequestError('Cart is empty', 400));
    }

    // Get order cart price from cart total price , in case of coupon applied, the cart price is cart discounted price
    const cartPrice = cart.coupon ? cart.totalCartDiscountedPrice : cart.totalCartPrice;

    // Get total price
    const total = cartPrice + tax + shipping;

    // Get address to deliver from user addresses
    const shippingAddress = req.user.addresses.find((address) => address.alias === req.body.shippingAddress);

    // Check if address doesn't exist
    if(!shippingAddress) next(new RequestError('No address found with that alias', 404));

    // Create order
    const order = await Order.create({
        user: req.user._id,
        items: cart.items,
        tax,
        shipping,
        total,
        shippingAddress,
    });

    // Check if order didn't create
    if(!order) next(new RequestError('Order not created', 500));

    // Add order to user orders
    await User.findByIdAndUpdate(req.user._id, { $addToSet: { orders: order._id } });

    // increase coupon numberOfUsage by 1
    if(cart.coupon) await Coupon.findByIdAndUpdate(cart.coupon, { $inc: { numberOfUsage: 1 } });

    // update products quantity and sold fields in db
    const bulkOptions = cart.items.map((item) => {
        return {
            updateOne: {
                filter: { _id: item.product },
                update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
            },
        };
    });
    await Product.bulkWrite(bulkOptions,{});

    // delete cart
    await Cart.findByIdAndDelete(req.params.id);

    // return order
    res.status(201).json({
        status: "success",
        message: "Order created successfully",
        order,
    });
}

// @desc    Create new cash order
// @route   POST /api/v1/orders/:id
// @access  Private (user)
// @params  id: cart id (cart to be ordered)
// @body    shippingAddress: string (alias of user address)
module.exports.createCashOrder = asyncHandler(createCashOrderHandler);


