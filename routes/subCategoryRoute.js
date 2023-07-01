// Purpose: subCategory routes
// require express
const express = require("express");
// require router
// mergeParams: true is required to access params from parent router
const router = express.Router({ mergeParams: true });

// require controllers
const { createSubCategory,
        setParentCategoryToBody,
        getAllSubCategories,
        createFilterObject,
        getSubCategoryById,
        updateSubCategoryById,
        deleteSubCategoryById } = require("../controllers/subCategoryController");

// require utils validators
const { createSubCategoryValidator,
        getSubCategoryByIdValidator,
        updateSubCategoryValidator,
        deleteSubCategoryByIdValidator } = require("../utils/ValidationLayer/Validators/SubCategoryValidators");

// require auth controllers
const { protect } = require("../controllers/authController");

// routes
router.route("/")
    .post(setParentCategoryToBody, createSubCategoryValidator, createSubCategory)
    .get(protect, createFilterObject, getAllSubCategories);

router.route("/:id")
    .get(getSubCategoryByIdValidator, getSubCategoryById)
    .put(protect, updateSubCategoryValidator, updateSubCategoryById)
    .delete(protect, deleteSubCategoryByIdValidator, deleteSubCategoryById);


module.exports = router;