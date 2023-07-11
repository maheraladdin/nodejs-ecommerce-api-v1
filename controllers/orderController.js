

// require third party modules
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// require custom modules
const asyncHandler = require('express-async-handler');
const Order = require('../models/orderModel');
const Cart = require('../models/cartModel');
const Product = require('../models/productModel');
const Coupon = require('../models/couponModel');
const RequestError = require('../utils/requestError');
const {getAll, getOne} = require("./handlersFactory");

/**
 * @desc    Filter orders for logged user
 * @param   {Object} req - request object
 * @param   {Object} req.user - logged user object
 * @param   {String} req.user.role - logged user role
 * @param   {Object} req.filterObj - filter object
 * @param   {Object} res - response object
 * @param   {Function} next - next middleware
 * @return  {Promise<void>}
 */
const filterOrdersForLoggedUserHandler = async (req, res, next) => {
    if(req.user.role === 'user') req.filterObj = {user: req.user._id};
    next();
}

module.exports.filterOrdersForLoggedUser = asyncHandler(filterOrdersForLoggedUserHandler);

// @desc    Get all orders for logged user
// @route   GET /api/v1/orders
// @access  Protected
module.exports.getOrders = getAll(Order);

/**
 * @desc    Check if order belongs to logged user
 * @param   {Object} req - request object
 * @param   {Object} req.user - logged user
 * @param   {String} req.user.role - logged user role
 * @param   {Object} req.params - order params
 * @param   {String} req.params.id - order id
 * @param   {Object} res - response object
 * @param   {Function} next - next middleware
 * @return  {Promise<*>}
 */
const belongsToUserHandler = async (req, res, next) => {
    if(req.user.role === "user") {
        const order = await Order.findById(req.params.id);
        if(!order.user.equals(req.user._id)) return next(new RequestError("You are not allowed to access this resource", 403));
    }
    next();
}

module.exports.belongsToUser = asyncHandler(belongsToUserHandler);

// @desc    Get order by id
// @route   GET /api/v1/orders/:id
// @access  Protected
// @params  {String} id - order id
module.exports.getOrder = getOne(Order, "Order");

/**
 * @desc    Create a new order with cash payment method (Cash on delivery)
 * @param   {Object} req - request object
 * @param   {Object} req.body - request body
 * @param   {String} req.body.shippingAddress - order shipping address alias
 * @param   {String} req.params - request params
 * @param   {String} req.params.id - cart id
 * @param   {Object} res - response object
 * @param   {Function} next - next middleware
 * @return  {Promise<*>}
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

/**
 * @desc    update order status handler
 * @param   {String} status - status name
 * @return  {(function(*, *): Promise<*|undefined>)|*}
 */
const updateStatusHandler = (status) => async (req,res) => {
    const statusValue = req.body[status] || true;
    const {id} = req.params;
    const order = await Order.findByIdAndUpdate(id,{[status]: statusValue, paidAt: Date.now()},{new: true});
    if(!order) return next(new RequestError("Order not found", 404));
    res.status(200).json({
        status: "success",
        message: "Order paid status updated successfully",
        order,
    });
}

// @desc    Update order pay status
// @route   PATCH /api/v1/orders/:id/pay
// @access  Private (admin, manager)
// @body    isPaid: boolean
module.exports.updateOrderPaidStatus = asyncHandler(updateStatusHandler("isPaid"));

// @desc    Update order deliver status
// @route   PATCH /api/v1/orders/:id/deliver
// @access  Private (admin, manager)
// @body    isDelivered: boolean
module.exports.updateOrderDeliverStatus = asyncHandler(updateStatusHandler("isDelivered"));

// @desc    Update order cancel status
// @route   PATCH /api/v1/orders/:id/cancel
// @access  Protected
// @body    isCancelled: boolean
module.exports.updateOrderCancelStatus = asyncHandler(updateStatusHandler("isCancelled"));

// @desc    Get checkout session for stripe payment
// @route   GET /api/v1/orders/:id/checkout-session
// @access  Private (user)
// @params  id: cart id (cart to be ordered)
module.exports.getCheckoutSession = asyncHandler(async (req, res,next) => {
    // app settings
    const tax = 0;
    const shipping = 0;
    // Get cart by id
    const cart = await Cart.findById(req.params.id);

    if (!cart) return next(new RequestError('No cart found with that id', 404));

    // Check if cart belongs to user
    if (cart.user.toString() !== req.user._id.toString()) return next(new RequestError('Not authorized to access this cart', 401));

    // Check if cart is empty
    if (cart.items.length === 0) return next(new RequestError('Cart is empty', 400));

    // Get order cart price from cart total price , in case of coupon applied, the cart price is cart discounted price
    const cartPrice = cart.coupon ? cart.totalCartDiscountedPrice : cart.totalCartPrice;

    // Get total price
    const total = cartPrice + tax + shipping;

    // Get address to deliver from user addresses
    const shippingAddress = req.user.addresses.find((address) => address.alias === req.body.shippingAddress);

    // Check if address doesn't exist
    if(!shippingAddress) next(new RequestError('No address found with that alias', 404));

    // Create stripe checkout session
    const session = await stripe.checkout.sessions.create({
        line_items: [
            {
                price_data: {
                    currency: 'egp',
                    unit_amount: total * 100,
                    product_data: {
                        name: req.user.name,
                        images: [req.user.profileImg],
                    }
                },
                quantity: 1,
            }
        ],
        mode: 'payment',
        success_url: `${req.protocol}://${req.get('host')}/api/v1/orders/${cart._id}/orders`,
        cancel_url: `${req.protocol}://${req.get('host')}/api/v1/orders/${cart._id}/cart`,
        customer_email: req.user.email,
        client_reference_id: cart._id,
        metadata: {
            shippingAddress,
        }
    });

    if(!session) return next(new RequestError('Checkout session not created', 500));

    // after creating session

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

    // return session
    res.status(200).json({
        status: "success",
        message: "Checkout session created successfully",
        session,
    })

});



