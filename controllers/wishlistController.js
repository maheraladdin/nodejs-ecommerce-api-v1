// Description: Handle User requests.
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");

/**
 * @desc    Get user wishlist
 * @param   {object} req - request object
 * @param   {object} req.user - user object
 * @param   {object} req.user.id - user id
 * @param   {object} res - response object
 */
const getUserWishlistHandler = async (req, res) => {
    const {wishlist} = await User.findById(req.user.id).populate('wishlist');
    res.status(200).json({
        status: 'success',
        message: 'User wishlist fetched successfully',
        length: wishlist.length,
        wishlist
    });
}

/*
 * @route   GET /api/v1/wishlist
 * @desc    Get user wishlist
 * @access  Private (user)
 */
module.exports.getUserWishlist = asyncHandler(getUserWishlistHandler);

/**
 * @desc    add product to user wishlist
 * @param   {object} req - request object
 * @param   {object} req.body - request body
 * @param   {object} req.body.product - product id
 * @param   {object} req.user - user object
 * @param   {object} req.user.id - user id
 * @param   {object} res - response object
 *
 */
const addProductToWishlistHandler = async (req, res) => {
    const {wishlist} = await User.findByIdAndUpdate(req.user.id, {$addToSet: {wishlist: req.body.product}}, {new: true}).populate('wishlist');
    res.status(200).json({
        status: 'success',
        message: 'Product added to wishlist successfully',
        wishlist
    });
}

/*
 * @desc    add product to user wishlist
 * @route   PATCH /api/v1/wishlist
 * @access  Private (user)
 */
module.exports.addProductToWishlist = asyncHandler(addProductToWishlistHandler);

/**
 * @desc    remove product from user wishlist
 * @param   {object} req - request object
 * @param   {object} req.params - request params
 * @param   {object} req.params.product - product id
 * @param   {object} req.user - user object
 * @param   {object} req.user.id - user id
 * @param   {object} res - response object
 */
const removeProductFromWishlistHandler = async (req, res) => {
    const {wishlist} = await User.findByIdAndUpdate(req.user.id, {$pull: {wishlist: req.params.product}}, {new: true}).populate('wishlist');
    res.status(200).json({
        message: 'Product removed from wishlist successfully',
        status: 'success',
        wishlist
    });
}

/*
 * @desc    remove product from user wishlist
 * @route   DELETE /api/v1/wishlist/:product
 * @access  Private (user)
 */
module.exports.removeProductFromWishlist = asyncHandler(removeProductFromWishlistHandler);

