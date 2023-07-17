const express = require('express');
const router = express.Router();

// require controllers
const {createCashOrder, belongsToUser, filterOrdersForLoggedUser, getOrder, getOrders, updateOrderCancelStatus, updateOrderDeliverStatus, updateOrderPaidStatus, getCheckoutSession} = require('../controllers/orderController');

// require validators
const {createCashOrderValidator, getOrderByIdValidator, updateOrderCancelStatusValidator, updateOrderDeliverStatusValidator, updateOrderPaidStatusValidator, getCheckoutSessionValidator} = require('../utils/ValidationLayer/Validators/orderValidators');

// require auth controllers
const {protect, restrictTo} = require('../controllers/authController');

// routes

router.use(protect);
router.get("/:id/checkout-session", restrictTo("user"), getCheckoutSessionValidator, getCheckoutSession)


router.route('/')
    .get(filterOrdersForLoggedUser, getOrders);

router.route('/:id')
    .get(belongsToUser, getOrderByIdValidator, getOrder)
    .post(restrictTo('user'), createCashOrderValidator, createCashOrder);

router.patch('/:id/pay', restrictTo("admin","manager"), updateOrderPaidStatusValidator, updateOrderPaidStatus);
router.patch('/:id/deliver', restrictTo("admin","manager"), updateOrderDeliverStatusValidator, updateOrderDeliverStatus);
router.patch('/:id/cancel', updateOrderCancelStatusValidator, belongsToUser, updateOrderCancelStatus);

module.exports = router;
