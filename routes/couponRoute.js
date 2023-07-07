
// require express
const express = require("express");

// require router
const router = express.Router();

// require utils validators
const { getCouponByIdValidator, createCouponValidator, deleteCouponValidator, updateCouponValidator } = require("../utils/ValidationLayer/Validators/couponValidators");

// require controllers
const { getCouponById, createCoupon, deleteCouponById, getCoupons, updateCouponById } = require("../controllers/couponController");

// require auth controllers
const { protect, restrictTo } = require("../controllers/authController");

// routes
router.use(protect, restrictTo("admin","manager"));

router.route("/")
    .get(getCoupons)
    .post(createCouponValidator, createCoupon);

router.route("/:id")
    .get(getCouponByIdValidator, getCouponById)
    .put(updateCouponValidator, updateCouponById)
    .delete(deleteCouponValidator, deleteCouponById);

module.exports = router;
