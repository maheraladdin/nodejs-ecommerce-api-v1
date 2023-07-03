// Purpose: User routes
// require express
const express = require("express");
// require router
const router = express.Router();

// require utils validators
const { getUserByIdValidator, createUserValidator, updateUserValidator, updateUserPasswordValidator, deleteUserValidator, updateUserRoleValidator } = require("../utils/ValidationLayer/Validators/UserValidators");

// require controllers
const { getUsers, getUserById, createUser, updateUserById, deleteUserById, uploadUserProfileImg, optimizeUserProfileImg, updateUserPassword, updateUserRole, reactiveAccount } = require("../controllers/UserController");

// require auth controllers
const { protect, restrictTo } = require("../controllers/authController");

// routes
router.route("/")
    .get(protect, restrictTo('admin','manager'), getUsers)
    .post(protect, restrictTo('admin'), uploadUserProfileImg, optimizeUserProfileImg, createUserValidator, createUser);

router.route("/:id")
    .get(protect, restrictTo('admin'), getUserByIdValidator, getUserById)
    .put(protect, restrictTo('admin'), uploadUserProfileImg, optimizeUserProfileImg, updateUserValidator, updateUserById)
    .delete(protect, restrictTo('admin'), deleteUserValidator, deleteUserById);

router.route("/change-password/:id")
    .patch(protect, updateUserPasswordValidator, updateUserPassword);

router.route("/change-role/:id")
    .patch(protect, restrictTo('admin','manager'), updateUserRoleValidator, updateUserRole);

router.route("/reactive-account/:id")
    .patch(protect, reactiveAccount);


module.exports = router;
