// Purpose: brand routes
// require express
const express = require("express");
// require router
const router = express.Router();

// require utils validators
const { addAddressToAddressesValidator, removeAddressFromAddressesValidator } = require("../utils/ValidationLayer/Validators/addressesValidators");

// require controllers
const { addAddressToUserAddresses, getUserAddresses, removeAddressFromUserAddresses } = require("../controllers/addressesController");

// require auth controllers
const { protect, restrictTo } = require("../controllers/authController");

// routes
router.use(protect, restrictTo("user"));

router.route("/")
    .get(getUserAddresses)
    .post(addAddressToAddressesValidator, addAddressToUserAddresses);

router.delete("/:address", removeAddressFromAddressesValidator, removeAddressFromUserAddresses);

module.exports = router;
