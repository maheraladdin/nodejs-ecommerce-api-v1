// Purpose: User routes
// require express
const express = require("express");
// require router
const router = express.Router();

// require utils validators
const { getUserByIdValidator, createUserValidator, updateUserValidator, updateUserPasswordValidator, deleteUserValidator, updateUserRoleValidator } = require("../utils/ValidationLayer/Validators/UserValidators");

// require controllers
const { getUsers, getUserById, createUser, updateUserById, deleteUserById, uploadUserProfileImg, optimizeUserProfileImg, updateUserPassword, updateUserRole, reactiveAccount, updateLoggedUserPassword } = require("../controllers/UserController");

// require auth controllers
const { protect, restrictTo } = require("../controllers/authController");

// protected routes
router.use(protect);
router.get("/loggedUser", getUserById);
router.patch("/changeLoggedUserPassword", updateUserPasswordValidator, updateLoggedUserPassword);

// Private routes for admin and manager
router.use(restrictTo('admin','manager'));

router.route("/")
    .get(getUsers)
    .post(uploadUserProfileImg, optimizeUserProfileImg, createUserValidator, createUser);

router.route("/:id")
    .get(getUserByIdValidator, getUserById)
    .put(uploadUserProfileImg, optimizeUserProfileImg, updateUserValidator, updateUserById)
    .delete(deleteUserValidator, deleteUserById);

router.route("/change-password/:id")
    .patch(updateUserPasswordValidator, updateUserPassword);

router.route("/change-role/:id")
    .patch(updateUserRoleValidator, updateUserRole);

router.route("/reactive-account/:id")
    .patch(reactiveAccount);


module.exports = router;
