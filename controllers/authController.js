// Desc: auth controller

// require third-party modules
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// require local modules
const asyncHandler = require("express-async-handler");
const RequestError = require("../utils/RequestError");
const User = require("../models/UserModel");
const {createOne} = require("./handlersFactory");

/**
 * @desc    generate token
 * @param   {Object} payload
 */
const generateToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES_IN});
}

/**
 * @desc    sign up user
 * @route   POST /api/v1/auth/signup
 * @access  public
 */
module.exports.signup = asyncHandler(async (req, res) => {
    // create new user
    const user = await createOne(User,{noResponse: true})(req, res);

    // generate token
    const token = generateToken({id: user._id});

    // send token
    res.status(201).json({
        status: "success",
        token,
        data: {
            user
        }
    });
});

/**
 * @desc    login user
 * @route   POST /api/v1/auth/login
 * @access  public
 */
module.exports.login = asyncHandler(async (req, res) => {
    const {email, password} = req.body;
    // check if email exists and password is correct
    const user = await User.findOne({email}).select("+password");
    if (!user || !(bcrypt.compareSync(password, user.password))) throw new RequestError("Incorrect email or password", 401);

    // generate token
    const token = generateToken({id: user._id});

    // send token
    res.status(200).json({
        status: "success",
        token,
        data: {
            user
        }
    });
});

/**
 * @desc    protect routes
 *
 */
module.exports.protect = asyncHandler(async (req, res, next) => {
    // 1) get token from request header
    const {authorization} = req.headers;
    if (!authorization || !authorization.startsWith("Bearer ")) throw new RequestError("You are not logged in! Please log in to get access.", 401);
    const token = authorization.split(" ")[1];

    // 2) verify token (check if token has valid signature and has not expired)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3) check if user exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) throw new RequestError("The user belonging to this token does no longer exist.", 401);

    /**
     * @desc    get passwordChangedAt from db
     * @type Date
     * @constant
     */
    const {passwordChangedAt} = currentUser;

    // 4) check if user changed password after the token was created
    if(passwordChangedAt) {
        const {iat: JWTTimestamp} = decoded;
        const passwordChangedTimestamp = parseInt(passwordChangedAt.getTime() / 1000,10);
        if(JWTTimestamp < passwordChangedTimestamp) throw new RequestError("password changed recently. please login again..",401);
    }

    req.user = currentUser;

    next();
});