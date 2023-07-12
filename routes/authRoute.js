const express = require('express');
const router = express.Router();

// require auth controllers
const {signup, login, forgetPassword, verifyPasswordResetToken, resetPassword} = require('../controllers/authController');

// require auth validators
const {signUpValidator, loginValidator, forgetPasswordValidator, resetPasswordValidator, verifyPasswordResetTokenValidator} = require('../utils/ValidationLayer/Validators/authValidators');

// require limiter
const limiter = require("../utils/rateLimit");

// auth routes
router.post('/signup', limiter, signUpValidator, signup);
router.post('/login', limiter, loginValidator, login);
router.post('/forgetPassword', limiter, forgetPasswordValidator, forgetPassword);
router.post('/verifyPasswordResetToken', limiter, verifyPasswordResetTokenValidator, verifyPasswordResetToken);
router.patch('/resetPassword', limiter, resetPasswordValidator, resetPassword);






module.exports = router;