// Purpose: category routes
// require express
const express = require("express");
// require router
const router = express.Router();

// require utils validators
const { getCategoryByIdValidator, createCategoryValidator, updateCategoryValidator, deleteCategoryValidator } = require("../utils/Validators/CategoryValidators");

// require controllers
const { getCategories, getCategoryById, createCategory, updateCategoryById, deleteCategoryById } = require("../controllers/categoryController");

router.use("/:id/subCategories", require("./subCategoryRoute"));

// routes
router.route("/")
    .get(getCategories)
    .post(createCategoryValidator, createCategory);

router.route("/:id")
    .get(getCategoryByIdValidator, getCategoryById)
    .put(updateCategoryValidator, updateCategoryById)
    .delete(deleteCategoryValidator, deleteCategoryById);

module.exports = router;
