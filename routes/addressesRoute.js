// Purpose: brand routes
// require express
const express = require("express");
// require router
const router = express.Router();

// require utils validators
// const { addProductToWishlistValidator, removeProductFromWishlistValidator } = require("../utils/ValidationLayer/Validators/wishlistValidators");

// require controllers
const { addAddressToUserAddresses, getUserAddresses, removeAddressFromUserAddresses } = require("../controllers/addressesController");

// require auth controllers
const { protect, restrictTo } = require("../controllers/authController");

// routes
router.use(protect, restrictTo("user"));

router.route("/")
    .get(getUserAddresses)
    .post(addAddressToUserAddresses);

router.delete("/:address", removeAddressFromUserAddresses);

module.exports = router;
