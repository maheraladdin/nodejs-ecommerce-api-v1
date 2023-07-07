const {idRule} = require("./RulesFactory");
const {check} = require("express-validator");
const Coupon = require("../../../models/couponModel");

/**
 * @desc:   Rule checks if coupon id is existed
 * @param   {string} value - coupon id
 * @return  {Promise<boolean>}
 */
const isCouponIdExist = async (value) => {
    const stateOfExistence = await Coupon.exists({_id: value});
    if (!stateOfExistence) {
        throw new Error("Coupon id is not exist");
    }
    return true;
}

module.exports.CouponIdRule = idRule("Coupon")
    .custom(isCouponIdExist)

/**
 * @desc: Rule checks if coupon name is unique
 * @param {string} value - coupon name
 * @return {Promise<boolean>}
 */
const isCouponNameUnique = async (value) => {
    // check if coupon name is unique
    const coupon = await Coupon.exists({name: value});
    if (coupon) {
        throw new Error("Coupon name must be unique");
    }
    return true;
}

/*
 * @desc: Rule checks if coupon name is provided, transforms it to lowercase, and unique
 */
module.exports.CouponNameRule = check("name")
    .trim()
    .notEmpty()
    .withMessage("Coupon name is required")
    .toLowerCase()
    .custom(isCouponNameUnique);

/**
 * @desc:   Rule checks if coupon expire date is valid (in the future)
 * @param   {Date} value - coupon expire date
 * @return  {boolean}
 */
const isCouponExpireDateValid = (value) => {
    // check if coupon expire date is in the future
    const now = new Date();
    const input = new Date(value);
    if (input < now)
        throw new Error("Coupon expire date must be in the future");
    return true;
}

/*
 * @desc: Rule checks if coupon name is provided, transforms it to lowercase, and unique
 */
module.exports.expireAtRule = check("expireAt")
    .notEmpty()
    .withMessage("Coupon expire date is required")
    .isDate()
    .withMessage("Coupon expire date must be a valid date")
    .custom(isCouponExpireDateValid);

/*
 * @desc: Rule checks if coupon discount is provided, and is between 0 and 100
 */
module.exports.discountRule = check("discount")
    .notEmpty()
    .withMessage("Coupon discount is required")
    .isNumeric()
    .withMessage("Coupon discount must be a number")
    .isFloat({min: 0, max: 100})
    .withMessage("Coupon discount must be between 0 and 100");

/*
 * @desc: Rule checks optionally if coupon name is provided, transforms it to lowercase, and unique
 */
module.exports.optionalCouponNameRule = check("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Coupon name is required")
    .toLowerCase()
    .custom(isCouponNameUnique);

/*
 * @desc: Rule checks optionally if coupon name is provided, transforms it to lowercase, and unique
 */
module.exports.optionalExpireAtRule = check("expireAt")
    .optional()
    .notEmpty()
    .withMessage("Coupon expire date is required")
    .isDate()
    .withMessage("Coupon expire date must be a valid date")
    .custom(isCouponExpireDateValid);

/*
 * @desc: Rule checks optionally if coupon discount is provided, and is between 0 and 100
 */
module.exports.optionalDiscountRule = check("discount")
    .optional()
    .notEmpty()
    .withMessage("Coupon discount is required")
    .isNumeric()
    .withMessage("Coupon discount must be a number")
    .isFloat({min: 0, max: 100})
    .withMessage("Coupon discount must be between 0 and 100");


