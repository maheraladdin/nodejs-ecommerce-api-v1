// Description: Handle Addresses requests.
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");

/**
 * @desc    Get user addresses
 * @param   {object} req - request object
 * @param   {object} req.user - logged user object
 * @param   {object} req.user.id - logged user id
 * @param   {object} res - response object
 */
const getUserAddressesHandler = async (req, res) => {
    const {addresses} = await User.findById(req.user.id).populate('addresses');
    res.status(200).json({
        status: 'success',
        message: 'User addresses fetched successfully',
        length: addresses.length,
        addresses
    });
}

/*
 * @route   GET /api/v1/addresses
 * @desc    Get logged user addresses
 * @access  Private (user)
 */
module.exports.getUserAddresses = asyncHandler(getUserAddressesHandler);

/**
 * @desc    Get user address by id
 * @param req
 * @param res
 * @return {Promise<void>}
 */
const getUserAddressByIdHandler = async (req, res) => {
    const {addresses} = await User.findById(req.user.id).populate('addresses');
    const address = addresses.find(address => address._id.toString() === req.params.address);
    res.status(200).json({
        status: 'success',
        message: 'User address fetched successfully',
        address,
    });
}

/*
 * @route   GET /api/v1/addresses/:address
 * @desc    Get logged user address by id
 * @access  Private (user)
 */
module.exports.getUserAddressById = asyncHandler(getUserAddressByIdHandler);

/**
 * @desc    add address to logged user addresses
 * @param   {object} req - request object
 * @param   {object} req.body - request body
 * @param   {object} req.user - logged user object
 * @param   {object} req.user.id -logged user id
 * @param   {object} res - response object
 *
 */
const addAddressToUserAddressesHandler = async (req, res) => {
    const {addresses} = await User.findByIdAndUpdate(req.user.id, {$addToSet: {addresses: req.body}}, {new: true});
    res.status(200).json({
        status: 'success',
        message: 'Address added to addresses list successfully',
        addresses
    });
}

/*
 * @desc    add address to logged user addresses
 * @route   PATCH /api/v1/addresses
 * @access  Private (user)
 * @body    alias, details, phone, city, postalCode
 */
module.exports.addAddressToUserAddresses = asyncHandler(addAddressToUserAddressesHandler);

const updateAddressInUserAddressesHandler = async (req, res) => {
    const {addresses} = await User.findById(req.user.id).populate('addresses');
    const newAddresses = addresses.map(address => {
        if(address._id.toString() === req.params.address) {
            return {...address, ...req.body};
        }
    });
    await User.findByIdAndUpdate(req.user.id, {addresses: newAddresses}, {new: true});
    res.status(200).json({
        status: 'success',
        message: 'Address updated successfully',
        addresses: newAddresses
    });
}

module.exports.updateAddressInUserAddresses = asyncHandler(updateAddressInUserAddressesHandler);

/**
 * @desc    remove address from user addresses
 * @param   {object} req - request object
 * @param   {object} req.params - request params
 * @param   {object} req.params.address - address id
 * @param   {object} req.user - logged user object
 * @param   {object} req.user.id - logged user id
 * @param   {object} res - response object
 */
const removeAddressFromUserAddressesHandler = async (req, res) => {
    const {addresses} = await User.findByIdAndUpdate(req.user.id, {$pull: {addresses: {_id: req.params.address}}}, {new: true});
    res.status(200).json({
        status: 'success',
        message: 'Address removed from addresses list successfully',
        addresses
    });
}

/*
 * @desc    remove address from user addresses
 * @route   DELETE /api/v1/addresses/:address
 * @access  Private (user)
 * @params  address
 */
module.exports.removeAddressFromUserAddresses = asyncHandler(removeAddressFromUserAddressesHandler);

