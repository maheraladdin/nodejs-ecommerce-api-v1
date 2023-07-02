// Purpose: To handle all the routes related to product
// require express
const express = require("express");
// require router
const router = express.Router();

// require utils validators
const {
    getProductByIdValidator,
    createProductValidator,
    updateProductValidator,
    deleteProductValidator
}  = require("../utils/ValidationLayer/Validators/ProductValidators");

// require controllers
const {
    getProducts,
    getProductById,
    createProduct,
    updateProductById,
    deleteProductById,
    uploadImages,
    optimizeImages
} = require("../controllers/productController");

// require auth controllers
const { protect, restrictTo } = require("../controllers/authController");

// routes
// @route: /api/v1/products
router.route("/")
    .get(getProducts)
    .post(protect, restrictTo("admin","manager"), uploadImages, optimizeImages, createProductValidator, createProduct);

// @route: /api/v1/products/:id
router.route("/:id")
    .get(getProductByIdValidator, getProductById)
    .put(protect, restrictTo("admin","manager"), uploadImages, optimizeImages, updateProductValidator, updateProductById)
    .delete(protect, restrictTo("admin"), deleteProductValidator, deleteProductById);

module.exports = router;
