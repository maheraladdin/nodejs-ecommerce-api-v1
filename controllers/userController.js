// Description: Handle User requests.
const {deleteOne, getAll, getOne, updateOne, createOne, optimizeImage} = require("./handlersFactory");
const upload = require("../middlewares/uploadImageMW");
const User = require("../models/UserModel");

/**
 * @route   GET /api/v1/users
 * @desc    Get all Users
 * @access  Private
 */
module.exports.getUsers = getAll(User);

/**
 * @route   GET /api/v1/users/:id
 * @desc    Get a User by id
 * @access  Private
 */
module.exports.getUserById = getOne(User,'User');

/**
 * @desc    optimize User profileImg
 * @type    {object}
 */
module.exports.optimizeUserProfileImg = optimizeImage({bodyField: "profileImg"});

/**
 * @desc    Middleware to upload a User profileImg
 * @type    {object}
 */
module.exports.uploadUserProfileImg = upload.single("profileImg");


/**
 * @route   POST /api/v1/users
 * @desc    Create a new User
 * @access  Private
 */
module.exports.createUser = createOne(User);

/**
 * @route   PUT /api/v1/users/:id
 * @desc    Update a User by id (you can't update password, active, role properties with this route)
 * @access  Private
 */
module.exports.updateUserById = updateOne(User, "User", {deleteFromRequestBody: ["password", "passwordConfirmation"]});

/**
 * @route   PUT /api/v1/users/change-password/:id
 * @desc    Update a User password by id
 * @type   {object}
 */
module.exports.updateUserPassword = updateOne(User, "User", {selectFromRequestBody: ["password", "passwordConfirmation"], hashPassword: true});

/**
 * @route   DELETE /api/v1/users/:id
 * @desc    Delete a User by id
 * @access  Private
 */
module.exports.deleteUserById = async (req, res, next) => {
    const stateOfDeletion = req.get("stateOfDeletion");
    if(!(stateOfDeletion === "soft")) return deleteOne(User,"User")(req,res,next);
    req.body.active = false;
    updateOne(User,"User")(req,res,next);
}