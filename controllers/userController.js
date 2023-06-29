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


const bodyField = "profileImg";
/**
 * @desc    optimize User profileImg
 * @type    {object}
 */
module.exports.optimizeUserProfileImg = optimizeImage({bodyField});

/**
 * @desc    Middleware to upload a User profileImg
 * @type    {object}
 */
module.exports.uploadUserProfileImg = upload.single(bodyField);


/**
 * @route   POST /api/v1/users
 * @desc    Create a new User
 * @access  Private
 */
module.exports.createUser = createOne(User);

/**
 * @route   PUT /api/v1/users/:id
 * @desc    Update a User by id
 * @access  Private
 */
module.exports.updateUserById = updateOne(User, "User");

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