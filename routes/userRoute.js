// Purpose: User routes
// require express
const express = require("express");
// require router
const router = express.Router();

// require utils validators
const { getUserByIdValidator, createUserValidator, updateUserValidator, updateUserPasswordValidator, deleteUserValidator, updateUserRoleValidator, updateLoggedUserDataValidator } = require("../utils/ValidationLayer/Validators/userValidators");

// require controllers
const { getUsers, getUserById, createUser, updateUserById, deleteUserById, uploadUserProfileImg, optimizeUserProfileImg, updateUserPassword, updateUserRole, reactiveAccountById, reactiveLoggedUserAccount, updateLoggedUserPassword, updateLoggedUserData, deleteLoggedUserAccount } = require("../controllers/userController");

// require auth controllers
const { protect, restrictTo } = require("../controllers/authController");

// protected routes
router.use(protect);
router.get("/loggedUser", getUserById);
router.patch("/changeLoggedUserPassword", updateUserPasswordValidator, updateLoggedUserPassword);
router.patch("/reactiveLoggedUserAccount", reactiveLoggedUserAccount);
router.put("/updateLoggedUserData", uploadUserProfileImg, optimizeUserProfileImg, updateLoggedUserDataValidator, updateLoggedUserData);
router.delete("/deactivateLoggedUserAccount", deleteLoggedUserAccount);

// Private routes for admin and manager
router.use(restrictTo('admin','manager'));

router.route("/")
    .get(getUsers)
    .post(uploadUserProfileImg, optimizeUserProfileImg, createUserValidator, createUser);

router.route("/:id")
    .get(getUserByIdValidator, getUserById)
    .put(uploadUserProfileImg, optimizeUserProfileImg, updateUserValidator, updateUserById)
    .delete(deleteUserValidator, deleteUserById);

router.patch("/reactive-account/:id", reactiveAccountById);

router.patch("/change-password/:id", updateUserPasswordValidator, updateUserPassword);

router.patch("/change-role/:id", updateUserRoleValidator, updateUserRole);


module.exports = router;
