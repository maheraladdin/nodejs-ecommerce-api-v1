// Purpose: User routes
// require express
const express = require("express");
// require router
const router = express.Router();

// require utils validators
const { getUserByIdValidator, createUserValidator, updateUserValidator, updateUserPasswordValidator, deleteUserValidator } = require("../utils/ValidationLayer/Validators/UserValidators");

// require controllers
const { getUsers, getUserById, createUser, updateUserById, deleteUserById, uploadUserProfileImg, optimizeUserProfileImg, updateUserPassword } = require("../controllers/UserController");

// routes
router.route("/")
    .get(getUsers)
    .post(uploadUserProfileImg, optimizeUserProfileImg, createUserValidator, createUser);

router.route("/:id")
    .get(getUserByIdValidator, getUserById)
    .put(uploadUserProfileImg, optimizeUserProfileImg, updateUserValidator, updateUserById)
    .delete(deleteUserValidator, deleteUserById);

router.route("/change-password/:id")
    .put(updateUserPasswordValidator, updateUserPassword);

module.exports = router;
