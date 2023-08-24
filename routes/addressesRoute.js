// Purpose: brand routes
// require express
const express = require("express");
// require router
const router = express.Router();

// require utils validators
const { addAddressToAddressesValidator, removeAddressFromAddressesValidator, getUserAddressByIdValidator, updateAddressInAddressesValidator } = require("../utils/ValidationLayer/Validators/addressesValidators");

// require controllers
const { addAddressToUserAddresses, getUserAddresses, removeAddressFromUserAddresses, getUserAddressById, updateAddressInUserAddresses } = require("../controllers/addressesController");

// require auth controllers
const { protect, restrictTo } = require("../controllers/authController");

// routes
router.use(protect, restrictTo("user"));

router.route("/")
    .get(getUserAddresses)
    .post(addAddressToAddressesValidator, addAddressToUserAddresses);

router.route("/:address")
    .get(getUserAddressByIdValidator, getUserAddressById)
    .put(updateAddressInAddressesValidator, updateAddressInUserAddresses)
    .delete(removeAddressFromAddressesValidator, removeAddressFromUserAddresses);

module.exports = router;
