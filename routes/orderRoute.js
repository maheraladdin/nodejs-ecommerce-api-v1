const express = require('express');
const router = express.Router();

// require controllers
const {createCashOrder, belongsToUser, filterOrdersForLoggedUser, getOrder, getOrders, updateOrderCancelStatus, updateOrderDeliverStatus, updateOrderPaidStatus} = require('../controllers/orderController');

// require auth controllers
const {protect, restrictTo} = require('../controllers/authController');

// routes
router.use(protect);

router.route('/')
    .get(filterOrdersForLoggedUser, getOrders);

router.route('/:id')
    .get(belongsToUser, getOrder)
    .post(restrictTo('user'), createCashOrder);

router.patch('/:id/pay', restrictTo("admin","manager"), updateOrderPaidStatus);
router.patch('/:id/deliver', restrictTo("admin","manager"), updateOrderDeliverStatus);
router.patch('/:id/cancel', belongsToUser, updateOrderCancelStatus);

module.exports = router;
