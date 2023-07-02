// Purpose: category routes
// require express
const express = require("express");
// require router
const router = express.Router();

// require utils validators
const { getCategoryByIdValidator, createCategoryValidator, updateCategoryValidator, deleteCategoryValidator } = require("../utils/ValidationLayer/Validators/CategoryValidators");

// require controllers
const {
    getCategories,
    getCategoryById,
    createCategory,
    updateCategoryById,
    deleteCategoryById,
    uploadCategoryImage,
    optimizeCategoryImage} = require("../controllers/categoryController");

const { protect, restrictTo } = require("../controllers/authController");

router.use("/:id/subCategories", require("./subCategoryRoute"));

// routes
router.route("/")
    .get(getCategories)
    .post(protect, restrictTo("admin","manager"), uploadCategoryImage, optimizeCategoryImage, createCategoryValidator, createCategory);

router.route("/:id")
    .get(getCategoryByIdValidator, getCategoryById)
    .put(protect, restrictTo("admin","manager"), uploadCategoryImage, optimizeCategoryImage, updateCategoryValidator, updateCategoryById)
    .delete(protect, restrictTo("admin"), deleteCategoryValidator, deleteCategoryById);

module.exports = router;
