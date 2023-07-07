// Purpose: brand routes
// require express
const express = require("express");
// require router
const router = express.Router();

// require utils validators
const { addProductToWishlistValidator, removeProductFromWishlistValidator } = require("../utils/ValidationLayer/Validators/wishlistValidators");

// require controllers
const { addProductToWishlist, removeProductFromWishlist, getUserWishlist } = require("../controllers/wishlistController");

// require auth controllers
const { protect, restrictTo } = require("../controllers/authController");

// routes
router.use(protect, restrictTo("user"));

router.route("/")
    .get(getUserWishlist)
    .post(addProductToWishlistValidator, addProductToWishlist);

router.delete("/:product", removeProductFromWishlistValidator, removeProductFromWishlist);

module.exports = router;
