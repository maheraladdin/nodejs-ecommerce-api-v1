// Description: Category routes

const express = require("express");
const router = express.Router();

// require utils
const { getCategoryByIdValidator, createCategoryValidator, updateCategoryValidator, deleteCategoryValidator } = require("../utils/Validators/CategoryValidators");

// require controllers
const { getCategories, getCategoryById, createCategory, updateCategory, deleteCategory } = require("../controllers/categoryController");

router.use("/:id/subCategories", require("./subCategoryRoute"));

// routes
router.route("/")
    .get(getCategories)
    .post(createCategoryValidator, createCategory);

router.route("/:id")
    .get(getCategoryByIdValidator, getCategoryById)
    .put(updateCategoryValidator, updateCategory)
    .delete(deleteCategoryValidator, deleteCategory);

module.exports = router;
