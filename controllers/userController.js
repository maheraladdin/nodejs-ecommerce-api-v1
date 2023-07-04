// Description: Handle User requests.
const {deleteOne, getAll, getOne, updateOne, createOne, optimizeImage} = require("./handlersFactory");
const upload = require("../middlewares/uploadImageMW");
const User = require("../models/UserModel");
const asyncHandler = require("express-async-handler");

/*
 * @route   GET /api/v1/users
 * @desc    Get all Users
 * @access  Private (admin, manager)
 */
module.exports.getUsers = getAll(User);

/*
 * @route   GET /api/v1/users/:id
 * @desc    Get a User by id
 * @access  Private (admin, manager)
 */
module.exports.getUserById = getOne(User,'User');

/*
 * @desc    optimize User profileImg
 * @type    {object}
 */
module.exports.optimizeUserProfileImg = optimizeImage({bodyField: "profileImg"});

/*
 * @desc    Middleware to upload a User profileImg
 * @type    {object}
 */
module.exports.uploadUserProfileImg = upload.single("profileImg");


/*
 * @route   POST /api/v1/users
 * @desc    Create a new User
 * @access  Private (admin, manager)
 */
module.exports.createUser = createOne(User);

/*
 * @route   PUT /api/v1/users/:id
 * @desc    Update a User by id (you can't update password, active, role properties with this route)
 * @access  Private (admin, manager)
 */
module.exports.updateUserById = updateOne(User, "User", {deleteFromRequestBody: ["password", "passwordConfirmation", "active", "role"]});

/*
 * @route   PUT /api/v1/users/updateLoggedUserData
 * @desc    Update logged User data (you can't update password, active, role properties with this route)
 * @access  Protected
 */
module.exports.updateLoggedUserData = updateOne(User, "User", {deleteFromRequestBody: ["password", "passwordConfirmation", "active", "role"]});

/*
 * @route   PATCH /api/v1/users/change-password/:id
 * @desc    Update a User password by id
 * @access  Private (admin, manager)
 */
module.exports.updateUserPassword = updateOne(User, "User", {selectFromRequestBody: ["password", "passwordConfirmation"], hashPassword: true});


/*
 * @route   PATCH /api/v1/users/changePassword
 * @desc    Update logged User password
 * @access  Protected
 */
module.exports.updateLoggedUserPassword = updateOne(User, "User", {selectFromRequestBody: ["password", "passwordConfirmation"], hashPassword: true, generateToken: true});

/*
 * @route   PATCH /api/v1/users/change-role/:id
 * @desc    Update a User role by id
 * @access  Private (admin, manager)
 */
module.exports.updateUserRole = updateOne(User, "User", {selectFromRequestBody: ["role"], roleChanged: true});

/*
 * @route   PATCH /api/v1/users/reactive-account/:id
 * @desc    Reactive a User account by id
 * @access  Private (admin, manager)
 */
module.exports.reactiveAccountById = updateOne(User, "User", {selectFromRequestBody: ["active"], reActive: true});

/*
 * @route   PATCH /api/v1/users/reactiveLoggedUserAccount
 * @desc    Reactive logged User account
 * @access  Protected
 */
module.exports.reactiveLoggedUserAccount = updateOne(User, "User", {selectFromRequestBody: ["active"], reActive: true, generateToken: true});


/**
 * @desc    Delete a User by id (soft or hard)
 * @param   {object} req - The request object
 * @param   {object} res - The response object
 * @param   {function} next - The next function
 * @return {Promise<*>}
 */
const deleteUserByIdHandler = async (req, res, next) => {
    const stateOfDeletion = req.get("stateOfDeletion");
    if(!(stateOfDeletion === "soft")) return deleteOne(User,"User")(req,res,next);
    req.body.active = false;
    updateOne(User,"User",{deActive: true})(req,res,next);
}

/*
 * @route   PATCH /api/v1/users/deactivateLoggedUserAccount
 * @desc    Deactivate logged User account
 * @access  Protected
 */
module.exports.deleteLoggedUserAccount = asyncHandler(deleteUserByIdHandler);

/*
 * @route   DELETE /api/v1/users/:id
 * @desc    Delete a User by id
 * @access  Private (admin, manager)
 */
module.exports.deleteUserById = asyncHandler(deleteUserByIdHandler);