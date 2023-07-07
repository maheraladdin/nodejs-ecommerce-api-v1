// Purpose: brand routes
// require express
const express = require("express");
// require router
const router = express.Router();

// require utils validators
// const { getBrandByIdValidator, createBrandValidator, updateBrandValidator, deleteBrandValidator } = require("../utils/ValidationLayer/Validators/brandValidators");

// require controllers
const { addProductToWishlist, removeProductFromWishlist, getUserWishlist } = require("../controllers/wishlistController");

// require auth controllers
const { protect, restrictTo } = require("../controllers/authController");

// routes
router.use(protect, restrictTo("user"));

router.route("/")
    .get(getUserWishlist)
    .post(addProductToWishlist);

router.delete("/:id", removeProductFromWishlist);

module.exports = router;
