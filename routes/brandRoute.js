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
const { protect } = require("../controllers/authController");

router.use("/:id/subCategories", require("./subCategoryRoute"));

// routes
router.route("/")
    .get(getBrands)
    .post(protect, uploadBrandImage, optimizeBrandImage, createBrandValidator, createBrand);

router.route("/:id")
    .get(getBrandByIdValidator, getBrandById)
    .put(protect, uploadBrandImage, optimizeBrandImage, updateBrandValidator, updateBrandById)
    .delete(protect, deleteBrandValidator, deleteBrandById);

module.exports = router;
