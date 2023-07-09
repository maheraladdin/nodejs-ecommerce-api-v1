
const express = require('express');
const router = express.Router();

const { addItemToCartValidator, applyCouponValidator, deleteItemFromCartValidator, updateItemQuantityValidator } = require('../utils/ValidationLayer/Validators/cartValidators');

const { addItemToCart, getCart, deleteItemFromCart, clearCartItems, updateItemQuantity,applyCoupon } = require('../controllers/cartController');

const { protect, restrictTo } = require('../controllers/authController');

router.use(protect, restrictTo("user"));

router.route('/')
    .get(getCart)
    .post(addItemToCartValidator, addItemToCart)
    .delete(clearCartItems);

router.patch('/applyCoupon', applyCouponValidator, applyCoupon);

router.route('/:id')
    .patch(updateItemQuantityValidator, updateItemQuantity)
    .delete(deleteItemFromCartValidator, deleteItemFromCart);

module.exports = router;