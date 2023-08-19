// Desc: auth controller

// require core modules
const crypto = require("crypto");

// require third-party modules
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// require custom modules
const asyncHandler = require("express-async-handler");
const RequestError = require("../utils/requestError");
const User = require("../models/userModel");
const {createOne,generateToken} = require("./handlersFactory");
const sendEmail = require("../utils/sendEmail");



/*
 * @desc    sign up user
 * @route   POST /api/v1/auth/signup
 * @access  public
 * @body    name, email, password, passwordConfirmation
 */
module.exports.signup = createOne(User,{generateToken: true});

/**
 * @desc    login user handler
 * @param   {Object} req - request object
 * @param   {Object} req.body - request body
 * @param   {String} req.body.email - user email
 * @param   {String} req.body.password - user password
 * @param   {Object} res - response object
 * @return {Promise<void>}
 */
const loginHandler = async (req, res) => {
    const {email, password} = req.body;
    // check if email exists and password is correct
    const user = await User.findOne({email}).select("+password");
    console.log(user);
    if (!user || !(bcrypt.compareSync(password, user.password))) throw new RequestError("Incorrect email or password", 401);

    // generate token
    const token = generateToken({id: user._id}, req.headers["remember-me"]);

    // send token
    res.status(200).json({
        status: "success",
        token,
        data: {
            user
        }
    });
}

/*
 * @desc    login user
 * @route   POST /api/v1/auth/login
 * @access  public
 * @body    email, password
 */
module.exports.login = asyncHandler(loginHandler);

/**
 * @desc    protect routes handler
 * @param   {Object} req - request object
 * @param   {Object} req.headers - request headers
 * @param   {String} req.headers.authorization - request authorization header
 * @param   {String} req.user - logged user object
 * @param   {String} req.iat - logged user token creation date
 * @param   {Object} res - response object
 * @param   {Function} next - next middleware function
 * @return  {Promise<void>}
 */
const protectHandler = async (req, res, next) => {
    // 1) get token from request header
    const {authorization} = req.headers;
    if (!authorization || !authorization.startsWith("Bearer ")) throw new RequestError("You are not logged in! Please log in to get access.", 401);
    const token = authorization.split(" ")[1];

    // 2) verify token (check if token has valid signature and has not expired)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3) check if user exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) throw new RequestError("The user belonging to this token does no longer exist.", 401);

    // 4) check if user changed password after the token was created
    const {passwordChangedAt} = currentUser;

    if(passwordChangedAt) {
        const {iat: JWTTimestamp} = decoded;
        const passwordChangedTimestamp = parseInt(passwordChangedAt.getTime() / 1000,10);
        if(JWTTimestamp < passwordChangedTimestamp) throw new RequestError("password changed recently. please login again..",401);
    }

    req.user = currentUser;
    req.iat = decoded.iat;
    next();
}

/*
 *  @desc    this middleware used to protect routes by making sure that the user is logged in before accessing the route
 *  @headers authorization - Bearer token
 */
module.exports.protect = asyncHandler(protectHandler);


/**
 * @desc    this middleware used to restrict routes by making sure that the user has the required role
 * @param   {Object} req - request object
 * @param   {Object} req.user - logged user object
 * @param   {String} req.user.role - logged user role
 * @param   {Date} req.user.roleChangedAt - logged user role changed date
 * @param   {Object} res - response object
 * @param   {Function} next - next middleware function
 * @param   {String} roles - required roles
 * @return  {void}
 */
const restrictToHandler = (req,res, next, ...roles) => {
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
}

/**
 * @desc    this middleware used to restrict routes by making sure that the user has the required role
 * @param   {String} roles
 * @returns {Function}
 * @type    Function
 */
module.exports.restrictTo = (...roles) =>
    asyncHandler((req, res, next) => restrictToHandler(req, res, next, ...roles));

/**
 * @desc    this middleware used to hash reset token
 * @param   {string} resetToken - reset token
 * @return  {string}
 */
const hash = (resetToken) => crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");


/**
 * @desc    this middleware used to ask for change password (send reset token to user's email)
 * @param   {object} req - request object
 * @param   {object} req.body - request body
 * @param   {string} req.body.email - user's email
 * @param   {object} res - response object
 * @return  {Promise<void>}
 */
const forgetPasswordHandler = async (req, res) => {
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
    user.passwordResetToken = hash(resetToken);

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
}

/*
 * @desc    this middleware used to ask for change password
 * @route   Post /api/v1/auth/forgetPassword
 * @access  Public
 * @body    {string} email - user's email
 */
module.exports.forgetPassword = asyncHandler(forgetPasswordHandler);

/**
 * @desc    this middleware used to verify reset token
 * @param   {object} req - request object
 * @param   {object} req.body - request body
 * @param   {string} req.body.passwordResetToken - reset token
 * @param   {object} res - response object
 * @return  {Promise<void>}
 */
const verifyPasswordResetTokenHandler = async (req, res) => {
    // 1) Get passwordResetToken from request body
    const {passwordResetToken} = req.body;

    // 2) Hash the reset token
    const hashedToken = hash(passwordResetToken);

    // 3) Get user based on the hashed token and check if token has not expired
    const user = await User.findOne({passwordResetToken: hashedToken, passwordResetTokenExpire: {$gt: Date.now()}});

    // 4) If there is no user, throw error (token is invalid or has expired)
    if(!user) throw new RequestError("Token is invalid or has expired", 400);
    if(user.passwordResetTokenVerification) throw new RequestError("Token already verified", 400);

    // 5) If there is user, set user passwordResetTokenVerification to true
    user.passwordResetTokenVerification = true;

    // 6) Save to db
    await user.save();

    // send response in case of success
    res.status(200).json({
        status: "Success",
        massage: "Token verified successfully",
    });
}

/*
 * @desc    this middleware used to verify password reset token
 * @route   Post /api/v1/auth/verifyPasswordResetToken
 * @access  Public
 * @body    {string} passwordResetToken - reset token
 */
module.exports.verifyPasswordResetToken = asyncHandler(verifyPasswordResetTokenHandler);


/**
 * @desc    this middleware used to reset password
 * @param   {object} req - request object
 * @param   {object} req.body - request body
 * @param   {string} req.body.email - user's email
 * @param   {string} req.body.password - user's password
 * @param   {object} res - response object
 * @return  {Promise<void>}
 */
const resetPasswordHandler = async (req, res) => {
    // get user based on the email and check if token has verified
    const {email} = req.body;
    const user = await User.findOne({email, passwordResetTokenVerification: true}).select("+password");

    // if there is no user, throw error (token is unverified)
    if(!user) throw new RequestError("Token is unverified", 400);

    // if there is user, hash password
    const salt = bcrypt.genSaltSync(10);
    const password = bcrypt.hashSync(req.body.password, salt);

    // update password and unset passwordResetToken, passwordResetTokenExpire, passwordResetTokenVerification
    await user.updateOne({password,$unset: {passwordResetToken: 1, passwordResetTokenExpire: 1, passwordResetTokenVerification: 1}});

    // log user in, send JWT
    const token = generateToken({id: user._id});

    // send response in case of success
    res.status(200).json({
        status: "Success",
        massage: "Password reset successfully",
        token,
    });
}

/*
 * @desc    this middleware used to reset password
 * @route   Post /api/v1/auth/resetPassword
 * @access  Public
 * @body    email, password, passwordConfirmation
 */
module.exports.resetPassword = asyncHandler(resetPasswordHandler);

/**
 * @desc    this middleware used to insert substring at index
 * @param   {String} str - string to insert in
 * @param   {String} substring - substring to insert
 * @param   {Number} index - index to insert at
 * @return  {String}
 */
function insertAtIndex(str, substring, index) {
    return str.slice(0, index) + substring + str.slice(index);
}

/**
 * @desc    this middleware used to create csrf token and send it to the client in header
 * @param   {object} req - request object
 * @param   {object} req.route - request route
 * @param   {string} req.route.path - request route path
 * @param   {object} req.session - logged user session
 * @param   {object} req.session.csrfToken - logged user csrf token
 * @param   {object} res - response object
 */
const createCsrfTokenHandler = (req, res) => {
    const path = req.route.path;
    let data = crypto.randomBytes(36).toString('base64'); //Generates pseudorandom data. The size argument is a number indicating the number of bytes to generate.
    const hashedUserId = hash(req.user._id.toString());
    data = insertAtIndex(data, hashedUserId, data.length / 2);
    if (path === "/createCsrfToken") {
        req.session.csrfToken = data; // Assigns a token parameter to the session.
        req.session.hashedUserId = hashedUserId;
    }
    res.status(200).json({
        result: true, message: 'Token created successfully.',csrfToken: data,
    });
}

/*
 * @desc    this middleware used to generate csrf token
 * @route   Get /api/v1/auth/createCsrfToken
 * @access  protected
 */
module.exports.createCsrfToken = asyncHandler(createCsrfTokenHandler);

/**
 * @desc    this middleware used to check csrf token from the request header and session.
 * @param   {object} req - request object
 * @param   {object} req.user - logged user object
 * @param   {object} req.session - logged user session
 * @param   {object} req.session.csrfToken - logged user csrf token
 * @param   {Function} req.get - Get request header by name
 * @param   {Object} res - response object
 * @param   {Function} next - next middleware
 */
const checkCsrfTokenHandler =  (req, res,next) => {
    const requestCsrfToken = req.get('CSRF-Token'); //The token sent within the request header.
    const hashedUserId = hash(req.user._id.toString());
    const sessionCsrfToken = req.session.csrfToken;
    if (!requestCsrfToken || !sessionCsrfToken) {
        res.status(401)
            .json({
                result: false, message: 'Token has not been provided.'
            });
    }

    // Check if the token sent within the request header is the same as the token stored in the session for the same user.
    const sessionUserAuth = requestCsrfToken.includes(hashedUserId);
    if (!sessionUserAuth) {
        res.status(401)
            .json({
                result: false, message: 'Invalid token.'
            });
    }

    if (requestCsrfToken !== sessionCsrfToken) {
        res.status(401)
            .json({
                result: false, message: 'Invalid token.'
            });
    }
    next();
}

/*
 * @desc    this middleware used to check csrf token from the request header and session.
 * @STP     Synchronizer Token Pattern
 * @headers  CSRF-Token
 */
module.exports.checkCsrfTokenSTD = asyncHandler(checkCsrfTokenHandler);



