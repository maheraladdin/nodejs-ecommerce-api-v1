const express = require('express');
const router = express.Router();

// require auth controllers
const {signup, login} = require('../controllers/authController');

// require auth validators
const {signUpValidator, loginValidator} = require('../utils/ValidationLayer/Validators/authValidators');

// auth routes
router.route('/signup').post(signUpValidator, signup);
router.route('/login').post(loginValidator, login);



module.exports = router;