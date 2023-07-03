const express = require('express');
const router = express.Router();

// require auth controllers
const {signup, login, forgetPassword} = require('../controllers/authController');

// require auth validators
const {signUpValidator, loginValidator} = require('../utils/ValidationLayer/Validators/authValidators');

// auth routes
router.post('/forgetPassword',forgetPassword);
router.post('/signup', signUpValidator, signup);
router.post('/login', loginValidator, login);





module.exports = router;