const express = require('express');
const router = express.Router();

// require auth controllers
const {signup, login, forgetPassword, verifyPasswordResetToken, resetPassword} = require('../controllers/authController');

// require auth validators
const {signUpValidator, loginValidator, forgetPasswordValidator, resetPasswordValidator, verifyPasswordResetTokenValidator} = require('../utils/ValidationLayer/Validators/authValidators');

// auth routes
router.post('/signup', signUpValidator, signup);
router.post('/login', loginValidator, login);
router.post('/forgetPassword', forgetPasswordValidator, forgetPassword);
router.post('/verifyPasswordResetToken', verifyPasswordResetTokenValidator, verifyPasswordResetToken);
router.patch('/resetPassword', resetPasswordValidator, resetPassword);






module.exports = router;