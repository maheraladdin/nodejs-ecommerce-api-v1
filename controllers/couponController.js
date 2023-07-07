// Description: Handle coupon requests.
const {deleteOne, getAll, getOne, updateOne, createOne} = require("./handlersFactory");
const Coupon = require("../models/couponModel");

/*
 * @route   GET /api/v1/coupons
 * @desc    Get all coupons
 * @access  Private (admin, manager)
*/
module.exports.getCoupons = getAll(Coupon);

/*
 * @route   GET /api/v1/coupons/:id
 * @desc    Get a coupon by id
 * @access  Private (admin, manager)
*/
module.exports.getCouponById = getOne(Coupon,'Coupon');

/*
 * @route   POST /api/v1/coupons
 * @desc    Create a new coupon
 * @access  Private (admin, manager)
*/
module.exports.createCoupon = createOne(Coupon);

/*
 * @route   PUT /api/v1/coupons/:id
 * @desc    Update a coupon by id
 * @access  Private (admin, manager)
*/
module.exports.updateCouponById = updateOne(Coupon, "Coupon");

/*
 * @route   DELETE /api/v1/coupons/:id
 * @desc    Delete a coupon by id
 * @access  Private (admin, manager)
*/
module.exports.deleteCouponById = deleteOne(Coupon, "Coupon");