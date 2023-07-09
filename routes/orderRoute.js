const express = require('express');
const router = express.Router();

// require controllers
const {createCashOrder} = require('../controllers/orderController');

// require auth controllers
const {protect, restrictTo} = require('../controllers/authController');

// routes
router.use(protect, restrictTo('user'));

router.route('/:id')
    .post(createCashOrder);

module.exports = router;
