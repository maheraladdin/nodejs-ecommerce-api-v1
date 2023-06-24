// Purpose: brand routes
// require express
const express = require("express");
// require router
const router = express.Router();

// require utils validators
const { getBrandByIdValidator, createBrandValidator, updateBrandValidator, deleteBrandValidator } = require("../utils/ValidationLayer/Validators/brandValidators");

// require controllers
const { getBrands, getBrandById, createBrand, updateBrandById, deleteBrandById } = require("../controllers/brandController");

router.use("/:id/subCategories", require("./subCategoryRoute"));

// routes
router.route("/")
    .get(getBrands)
    .post(createBrandValidator, createBrand);

router.route("/:id")
    .get(getBrandByIdValidator, getBrandById)
    .put(updateBrandValidator, updateBrandById)
    .delete(deleteBrandValidator, deleteBrandById);

module.exports = router;
