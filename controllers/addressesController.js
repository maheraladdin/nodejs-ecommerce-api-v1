// Description: Handle User requests.
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");

/**
 * @desc    Get user addresses
 * @param   {object} req - request object
 * @param   {object} req.user - user object
 * @param   {object} req.user.id - user id
 * @param   {object} res - response object
 */
const getUserAddressesHandler = async (req, res) => {
    const {addresses} = await User.findById(req.user.id).populate('addresses');
    res.status(200).json({
        status: 'success',
        message: 'User wishlist fetched successfully',
        length: addresses.length,
        addresses
    });
}

/*
 * @route   GET /api/v1/addresses
 * @desc    Get user wishlist
 * @access  Private (user)
 */
module.exports.getUserAddresses = asyncHandler(getUserAddressesHandler);

/**
 * @desc    add address to user addresses
 * @param   {object} req - request object
 * @param   {object} req.body - request body
 * @param   {object} req.user - user object
 * @param   {object} req.user.id - user id
 * @param   {object} res - response object
 *
 */
const addAddressToUserAddressesHandler = async (req, res) => {
    const {addresses} = await User.findByIdAndUpdate(req.user.id, {$addToSet: {addresses: req.body}}, {new: true});
    res.status(200).json({
        status: 'success',
        message: 'Address added to wishlist successfully',
        addresses
    });
}

/*
 * @desc    add product to user wishlist
 * @route   PATCH /api/v1/addresses
 * @access  Private (user)
 */
module.exports.addAddressToUserAddresses = asyncHandler(addAddressToUserAddressesHandler);

/**
 * @desc    remove address from user addresses
 * @param   {object} req - request object
 * @param   {object} req.params - request params
 * @param   {object} req.params.product - product id
 * @param   {object} req.user - user object
 * @param   {object} req.user.id - user id
 * @param   {object} res - response object
 */
const removeAddressFromUserAddressesHandler = async (req, res) => {
    const {addresses} = await User.findByIdAndUpdate(req.user.id, {$pull: {addresses: {_id: req.params.address}}}, {new: true});
    res.status(200).json({
        message: 'Product removed from wishlist successfully',
        status: 'success',
        addresses
    });
}

/*
 * @desc    remove product from user wishlist
 * @route   DELETE /api/v1/addresses/:address
 * @access  Private (user)
 */
module.exports.removeAddressFromUserAddresses = asyncHandler(removeAddressFromUserAddressesHandler);

