
const express = require('express');
const router = express.Router({ mergeParams: true});

const { addItemToCart, getCart, deleteItemFromCart, clearCartItems, updateItemQuantity,applyCoupon } = require('../controllers/cartController');

const { protect, restrictTo } = require('../controllers/authController');

router.use(protect, restrictTo("user"));

router.route('/')
    .get(getCart)
    .post(addItemToCart)
    .delete(clearCartItems);

router.patch('/applyCoupon', applyCoupon);

router.route('/:id')
    .patch(updateItemQuantity)
    .delete(deleteItemFromCart);

module.exports = router;