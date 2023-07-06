// Purpose: brand routes
// require express
const express = require("express");
// require router
const router = express.Router();

// require utils validators
const { getBrandByIdValidator, createBrandValidator, updateBrandValidator, deleteBrandValidator } = require("../utils/ValidationLayer/Validators/brandValidators");

// require controllers
const { getBrands, getBrandById, createBrand, updateBrandById, deleteBrandById, uploadBrandImage, optimizeBrandImage } = require("../controllers/brandController");

// require auth controllers
const { protect, restrictTo } = require("../controllers/authController");

// routes
router.route("/")
    .get(getBrands)
    .post(protect, restrictTo("admin","manager"), uploadBrandImage, optimizeBrandImage, createBrandValidator, createBrand);

router.route("/:id")
    .get(getBrandByIdValidator, getBrandById)
    .put(protect, restrictTo("admin","manager"), uploadBrandImage, optimizeBrandImage, updateBrandValidator, updateBrandById)
    .delete(protect, restrictTo("admin"), deleteBrandValidator, deleteBrandById);

module.exports = router;
