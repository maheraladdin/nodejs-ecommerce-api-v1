const asyncHandler = require('express-async-handler');
const RequestError = require('../utils/requestError');
const Cart = require('../models/cartModel');
const Product = require('../models/productModel');
const Coupon = require('../models/couponModel');

/**
 * @desc    Calculate total cart price for logged user
 * @param   {object} cart - cart object
 * @return  {number}
 */
const calculateCartPrice = (cart) =>
    Math.round(cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0));

/**
 * @desc    Get cart for logged user , if cart does not exist, throw error
 * @param   {object} req - request object
 * @param   {object} req.user - logged user object
 * @param   {string} req.user._id - logged user id
 * @param   {object} res - response object
 * @throws  RequestError if cart does not exist
 * @return {Promise<void>}
 */
const getCartHandler = async (req, res) => {
    // Get cart for logged in user
    const cart = await Cart.findOne({ user: req.user._id });

    // If cart does not exist, throw error
    if(!cart) {
        throw new RequestError("Cart does not exist for logged user", 404);
    }

    // Calculate total cart price
    cart.totalCartPrice = calculateCartPrice(cart);
    cart.totalCartDiscountedPrice = undefined;
    cart.coupon = undefined;
    // Save cart
    await cart.save();

    // get cart length
    const length = cart.items.length;

    // Send response
    res.status(200).json({
        status: "success",
        message: "Cart fetched successfully",
        length,
        cart
    });
}

// @desc    Get cart for logged in user
// @route   GET /api/cart
// @access  Private (user)
module.exports.getCart = asyncHandler(getCartHandler);

/**
 * @desc    Add product to cart ,if cart does not exist, create new cart and add product to cart , if cart exists, check if product already exists in cart, if product exists, update quantity in cart, if product does not exist, add product to cart
 * @param   {object} req - request object
 * @param   {object} req.body - request body
 * @param   {string} req.body.product - product id
 * @param   {string} req.body.color - product color
 * @param   {object} req.user - logged user object
 * @param   {string} req.user._id - logged user id
 * @param   {object} res - response object
 * @return {Promise<void>}
 */
const  addItemToCartHandler = async (req, res) => {
    // Get product and color from request body
    const { product, color } = req.body;

    // Get product price from database
    const {price} = await Product.findById(product);

    // save message to be sent in response
    let message;

    // Get Cart for logged in user
    let cart = await Cart.findOne({ user: req.user._id });

    // if cart does not exist, create new cart
    if(!cart) {
        cart = await Cart.create({user: req.user._id, items: [{product, color, price}]});
        message = "Cart created and product added to cart";
    }
    else {
        // Check if product already exists in cart , update quantity in cart
        const productExists = cart.items.find(item => item.product._id.toString() === product.toString() && item.color === color);
        if(productExists) {
            productExists.quantity += 1;
            message = "product quantity updated in cart";
        }
        else {
            // If product does not exist in cart, add product to cart
            cart.items.push({product, color, price});
            message = "product added to cart";
        }
    }

    // Update total cart price
    cart.totalCartPrice = Math.round(cart.totalCartPrice + price);
    cart.totalCartDiscountedPrice = undefined;
    cart.coupon = undefined;
    // save cart
    await cart.save();

    // get cart length
    const length = cart.items.length;

    // Send response
    res.status(200).json({
        status: "success",
        message,
        length,
        cart
    });
}

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private (user)
// @body    {string} product - product id, {string} color - product color
module.exports.addItemToCart = asyncHandler(addItemToCartHandler);

/**
 * @desc    update item quantity in cart
 * @param   {object} req - request object
 * @param   {object} req.body - request body
 * @param   {number} req.body.quantity - item quantity
 * @param   {object} req.user - logged user object
 * @param   {string} req.user._id - logged user id
 * @param   {object} res - response object
 * @throws  RequestError if item does not exist in cart
 * @return {Promise<void>}
 */
const updateItemQuantityHandler = async (req, res) => {
    // Get cart for logged in user
    const cart = await Cart.findOne({ user: req.user._id });

    // Get item index
    const item = cart.items.find(item => item._id.toString() === req.params.id);

    // If item does not exist, throw error
    if(!item) throw new RequestError("Item does not exist in cart", 404);

    // Get product price
    const {price} = await Product.findById(item.product);

    // Update total cart price
    cart.totalCartPrice = Math.round(cart.totalCartPrice - item.price * item.quantity + price * req.body.quantity);
    cart.totalCartDiscountedPrice = undefined;
    cart.coupon = undefined;
    // Update item quantity
    item.quantity = req.body.quantity;

    // Save cart
    await cart.save();

    // Get cart length
    const length = cart.items.length;

    // Send response
    res.status(200).json({
        status: "success",
        message: "Item quantity updated successfully",
        length,
        cart
    });
}

//@desc     Update item quantity in cart
//@route    PATCH /api/cart/:id
//@access   Private (user)
//@body     quantity - item quantity
//@param    id - item id
module.exports.updateItemQuantity = asyncHandler(updateItemQuantityHandler);

/**
 * @desc    Apply coupon to cart
 * @param   {object} req - request object
 * @param   {object} req.body - request body
 * @param   {string} req.body.name - coupon name
 * @param   {object} req.user - logged user object
 * @param   {string} req.user._id - logged user id
 * @param   {object} res - response object
 * @throws  RequestError if cart does not exist, if coupon does not exist, if coupon is already applied, if coupon is expired, or is used max number of times
 * @return {Promise<void>}
 */
const applyCouponHandler = async (req, res) => {
    // Get coupon from request body
    const { name } = req.body;

    // Get cart for logged in user
    const cart = await Cart.findOne({ user: req.user._id });

    // If cart does not exist, throw error
    if(!cart)
        throw new RequestError("Cart does not exist for logged user", 404);

    // Get coupon from database {name, expireAt, discount, maxDiscount, numberOfUsage }
    const couponFromDB  = await Coupon.findOne({ name, expireAt: { $gt: Date.now() } });

    // If coupon does not exist, throw error
    if(!couponFromDB)
        throw new RequestError("Coupon does not exist", 404);

    // If coupon is already applied, throw error
    if(cart.coupon && cart.coupon.toString() === couponFromDB._id.toString())
        throw new RequestError("Coupon is already applied", 400);

    // If coupon is expired, or is used max number of times, throw error
    if(couponFromDB.numberOfUsage >= couponFromDB.maxNumberOfUsage)
        throw new RequestError("Coupon is expired", 400);

    // Apply coupon to cart
    cart.coupon = couponFromDB._id;

    // Update total cart discount price
    let discountValue = Math.round(cart.totalCartPrice * couponFromDB.discount / 100);
    if(discountValue > couponFromDB.maxDiscount) discountValue = couponFromDB.maxDiscount;
    cart.totalCartDiscountedPrice = Math.round(cart.totalCartPrice - discountValue);

    // Save cart
    await cart.save();

    // Get cart length
    const length = cart.items.length;

    // Send response
    res.status(200).json({
        status: "success",
        message: "Coupon applied successfully",
        couponId: couponFromDB._id,
        length,
        cart
    });
}

//@desc     Apply coupon to cart
//@route    PATCH /api/cart/applyCoupon
//@access   Private (user)
//@body     name - coupon name
module.exports.applyCoupon = asyncHandler(applyCouponHandler);

/**
 * @desc    Delete Item from Cart based on item id
 * @param   {object} req - req object
 * @param   {object} req.params - request params
 * @param   {string} req.params.id - item id
 * @param   {object} req.user - logged user object
 * @param   {string} req.user._id - logged user id
 * @param   {object} res - response object
 * @return {Promise<void>}
 */
const deleteItemFromCartHandler = async (req, res) => {
    // Get cart for logged in user
    const cart = await Cart.findOne({ user: req.user._id });

    // Get item index.js
    const item = cart.items.find(item => item._id.toString() === req.params.id);

    // If item does not exist, throw error
    if(!item) throw new RequestError("Item does not exist in cart", 404);

    // Update total cart price
    cart.totalCartPrice = Math.round(cart.totalCartPrice - item.price * item.quantity);
    cart.totalCartDiscountedPrice = undefined;
    cart.coupon = undefined;
    // Remove item from cart
    cart.items = cart.items.filter(item => item._id.toString() !== req.params.id);

    // Save cart
    await cart.save();

    // get cart length
    const length = cart.items.length;

    // Send response
    res.status(200).json({
        status: "success",
        message: "item deleted from cart",
        length,
        cart
    });
}

// @desc    Delete product from cart by item id
// @route   DELETE /api/cart/:id
// @access  Private (user)
// @param   id - item id
module.exports.deleteItemFromCart = asyncHandler(deleteItemFromCartHandler);

/**
 * @desc    clear cart items
 * @param   {object} req - request object
 * @param   {object} req.user - logged user object
 * @param   {string} req.user._id - logged user id
 * @param   {object} res - response object
 * @return {Promise<void>}
 */
const clearCartItemsHandler = async (req, res) => {
    // Get cart for logged in user
    const cart = await Cart.findOne({ user: req.user._id });

    // If cart does not exist, throw error
    if(!cart) throw new RequestError("Cart does not exist for logged user", 4);

    // Update total cart price
    cart.totalCartPrice = 0;
    cart.totalCartDiscountedPrice = undefined;
    cart.coupon = undefined;
    // Remove all items from cart
    cart.items = [];

    // Save cart
    await cart.save();

    // get cart length
    const length = cart.items.length;

    // Send response
    res.status(200).json({
        status: "success",
        message: "cart cleared successfully",
        length,
        cart
    });
}

// @desc    Delete cart for logged in user
// @route   DELETE /api/cart
// @access  Private (user)
module.exports.clearCartItems = asyncHandler(clearCartItemsHandler);
