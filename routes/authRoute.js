const express = require('express');
const router = express.Router();

// require auth controllers
const {signup, login, forgetPassword, verifyPasswordResetToken, resetPassword, createCsrfToken, protect} = require('../controllers/authController');

// require auth validators
const {signUpValidator, loginValidator, forgetPasswordValidator, resetPasswordValidator, verifyPasswordResetTokenValidator} = require('../utils/ValidationLayer/Validators/authValidators');

// require limiter
const limiter = require("../utils/rateLimit");

// create limiters
const signupLimiter = new limiter(15, 5, 'Too many requests created from this IP, please try again after 15 minutes');
const loginLimiter = new limiter(15, 5, 'Too many requests created from this IP, please try again after 15 minutes');
const forgetPasswordLimiter = new limiter(15, 5, 'Too many requests created from this IP, please try again after 15 minutes');
const resetPasswordLimiter = new limiter(15, 5, 'Too many requests created from this IP, please try again after 15 minutes');
const verifyPasswordResetTokenLimiter = new limiter(15, 5, 'Too many requests created from this IP, please try again after 15 minutes');

// auth routes
router.post('/signup', signupLimiter, signUpValidator, signup);
router.post('/login', loginLimiter, loginValidator, login);
router.post('/forgetPassword', forgetPasswordLimiter, forgetPasswordValidator, forgetPassword);
router.post('/verifyPasswordResetToken', verifyPasswordResetTokenLimiter, verifyPasswordResetTokenValidator, verifyPasswordResetToken);
router.patch('/resetPassword', resetPasswordLimiter, resetPasswordValidator, resetPassword);
router.post("/createCsrfToken",protect , createCsrfToken);





module.exports = router;