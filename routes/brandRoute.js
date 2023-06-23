// Description: Category routes

const express = require("express");
const router = express.Router();

// require utils
const { getBrandByIdValidator, createBrandValidator, updateBrandValidator, deleteBrandValidator } = require("../utils/Validators/brandValidators");

// require controllers
const { getBrands, getBrandById, createBrand, updateBrand, deleteBrand } = require("../controllers/brandController");

router.use("/:id/subCategories", require("./subCategoryRoute"));

// routes
router.route("/")
    .get(getBrands)
    .post(createBrandValidator, createBrand);

router.route("/:id")
    .get(getBrandByIdValidator, getBrandById)
    .put(updateBrandValidator, updateBrand)
    .delete(deleteBrandValidator, deleteBrand);

module.exports = router;
