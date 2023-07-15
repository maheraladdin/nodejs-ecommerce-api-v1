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
 * @params  id - coupon id
*/
module.exports.getCouponById = getOne(Coupon,'Coupon');

/*
 * @route   POST /api/v1/coupons
 * @desc    Create a new coupon
 * @access  Private (admin, manager)
 * @body    name, discount, expireAt, maxDiscount, maxNumberOfUsage
*/
module.exports.createCoupon = createOne(Coupon);

/*
 * @route   PUT /api/v1/coupons/:id
 * @desc    Update a coupon by id
 * @access  Private (admin, manager)
 * @params  id - coupon id
 * @body    name, discount, expireAt, maxDiscount, maxNumberOfUsage
*/
module.exports.updateCouponById = updateOne(Coupon, "Coupon");

/*
 * @route   DELETE /api/v1/coupons/:id
 * @desc    Delete a coupon by id
 * @access  Private (admin, manager)
 * @params  id - coupon id
*/
module.exports.deleteCouponById = deleteOne(Coupon, "Coupon");