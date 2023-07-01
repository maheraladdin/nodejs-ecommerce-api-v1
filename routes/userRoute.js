// Purpose: User routes
// require express
const express = require("express");
// require router
const router = express.Router();

// require utils validators
const { getUserByIdValidator, createUserValidator, updateUserValidator, updateUserPasswordValidator, deleteUserValidator } = require("../utils/ValidationLayer/Validators/UserValidators");

// require controllers
const { getUsers, getUserById, createUser, updateUserById, deleteUserById, uploadUserProfileImg, optimizeUserProfileImg, updateUserPassword } = require("../controllers/UserController");

// require auth controllers
const { protect } = require("../controllers/authController");

// routes
router.route("/")
    .get(protect, getUsers)
    .post(protect, uploadUserProfileImg, optimizeUserProfileImg, createUserValidator, createUser);

router.route("/:id")
    .get(protect, getUserByIdValidator, getUserById)
    .put(protect, uploadUserProfileImg, optimizeUserProfileImg, updateUserValidator, updateUserById)
    .delete(protect, deleteUserValidator, deleteUserById);

router.route("/change-password/:id")
    .put(updateUserPasswordValidator, updateUserPassword);

module.exports = router;
