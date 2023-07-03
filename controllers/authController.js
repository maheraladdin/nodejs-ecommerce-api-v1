// Desc: auth controller

// require core modules
const crypto = require("crypto");

// require third-party modules
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// require custom modules
const asyncHandler = require("express-async-handler");
const RequestError = require("../utils/RequestError");
const User = require("../models/UserModel");
const {createOne} = require("./handlersFactory");
const sendEmail = require("../utils/sendEmail");

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
 * @desc    this middleware used to protect routes by making sure that the user is logged in
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
    req.iat = decoded.iat;
    next();
});

/**
 * @desc    this middleware used to restrict routes by making sure that the user has the required role
 * @param   {String} roles
 * @returns {Function}
 * @type    Function
 */
module.exports.restrictTo = (...roles) =>
    asyncHandler((req, res, next) => {

        /**
         * @desc    get roleChangedAt from db
         * @type Date
         * @constant
         */
        const {roleChangedAt} = req.user;

        // 1) check if user role changed after the token was created
        if (roleChangedAt) {
            const {iat: JWTTimestamp} = req;
            const roleChangedTimestamp = parseInt(roleChangedAt.getTime() / 1000, 10);
            if (JWTTimestamp < roleChangedTimestamp) throw new RequestError("role changed recently. please login again..", 401);
        }

        // 2) check if user role is included in roles array
        if (!roles.includes(req.user.role)) throw new RequestError("You do not have permission to perform this action", 403);

        next();
    });

/**
 * @desc    this middleware used to ask for change password
 * @route   Post /api/v1/auth/forget-password
 * @access  Public
 */
module.exports.forgetPassword = asyncHandler(async (req, res) => {
    // 1) get user based on posted email
    const {email} = req.body;

    // 2) check if user exists
    const user = await User.findOne({email});
    if(!user) throw new RequestError("There is no user with email address.",404);

    // 3) generate random reset token
    const resetToken = Math.floor(100000 + Math.random() * 900000).toString();

    // 4) send it to user's email
    const message =
        `Hi ${user.name}, \n\nWe received a request to reset the password on your E-shop Account. \n\n${resetToken} \n\nEnter this code to complete the reset. \n\nThanks to help us make your account secure. \n\nThe E-shop Team`;
    try {
        await sendEmail({
            FromEmail: `E-shop App <${process.env.EMAIL_USER}>`,
            toEmail: email,
            subject: `Password reset code (valid for 10 minutes)`,
            message,
        });
    } catch (err) {
        throw new RequestError("There was an error sending the email. Try again later!", 500);
    }

    // 5) add hashed reset token
    user.passwordResetToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

    // 6) add Expire date for password reset token (10 min)
    user.passwordResetTokenExpire = Date.now() + (10 * 60 * 1000);

    // 7) add password reset token verified
    user.passwordResetTokenVerification = false;

    // 8) save to db
    await user.save();

    // send response in case of success
    res.status(200).json({
       status: "Success",
       massage: "Reset code sent to your email",
    });
});
