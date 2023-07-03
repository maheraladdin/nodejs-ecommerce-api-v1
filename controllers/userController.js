// Description: Handle User requests.
const {deleteOne, getAll, getOne, updateOne, createOne, optimizeImage,generateToken} = require("./handlersFactory");
const upload = require("../middlewares/uploadImageMW");
const User = require("../models/UserModel");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");

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

/**
 * @desc    Middleware to set logged User id as id param
 * @param   {object} req - The request object
 * @param   {object} req.user - The logged user
 * @param   {string} req.user.id - The logged user id
 * @param   {object} req.params - The request params
 * @param   {string} req.params.id - The id param
 * @param   {object} res - The response object
 * @param   {function} next - The next function
 * @return  {Promise<void>}
 */
const getLoggedUserHandler = async (req, res,next) => {
    req.params.id = req.user.id;
    next();
}

/*
 * @route   GET /api/v1/users/loggedUser
 * @desc    Get logged in User
 * @access  Protected
 */
module.exports.getLoggedUser = asyncHandler(getLoggedUserHandler);

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
 * @route   PUT /api/v1/users/change-password/:id
 * @desc    Update a User password by id
 * @access  Private (admin, manager)
 */
module.exports.updateUserPassword = updateOne(User, "User", {selectFromRequestBody: ["password", "passwordConfirmation"], hashPassword: true});

/**
 * @desc    Update logged User password
 * @param   {object} req - The request object
 * @param   {object} req.user - The logged user
 * @param   {string} req.body.password - The new password
 * @param   {object} res - The response object
 * @return  {Promise<void>}
 */
const updateLoggedUserPasswordHandler = async (req, res) => {

    // update password
    await User.findByIdAndUpdate(req.user.id, {password: bcrypt.hashSync(req.body.password,10), passwordChangedAt: Date.now()});

    // generate token
    const token = generateToken({id: req.user.id});

    res.status(200).json({
        status: "success",
        message: "Password updated successfully",
        token,
    });
}

/*
 * @route   PUT /api/v1/users/changePassword
 * @desc    Update logged User password
 * @access  Protected
 */
module.exports.updateLoggedUserPassword = asyncHandler(updateLoggedUserPasswordHandler);

/*
 * @route   PUT /api/v1/users/change-role/:id
 * @desc    Update a User role by id
 * @access  Private (admin, manager)
 */
module.exports.updateUserRole = updateOne(User, "User", {selectFromRequestBody: ["role"], roleChanged: true});

/*
 * @route   PUT /api/v1/users/reactive-account/:id
 * @desc    Reactive a User account by id
 * @access  Private (admin, manager)
 */
module.exports.reactiveAccount = updateOne(User, "User", {selectFromRequestBody: ["active"], reActive: true});

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
    updateOne(User,"User")(req,res,next);
}

/**
 * @route   DELETE /api/v1/users/:id
 * @desc    Delete a User by id
 * @access  Private (admin, manager)
 */
module.exports.deleteUserById = asyncHandler(deleteUserByIdHandler);