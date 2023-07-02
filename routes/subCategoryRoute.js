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
const { protect, restrictTo } = require("../controllers/authController");

// routes
router.route("/")
    .post(protect, restrictTo("admin","manager"), setParentCategoryToBody, createSubCategoryValidator, createSubCategory)
    .get(createFilterObject, getAllSubCategories);

router.route("/:id")
    .get(getSubCategoryByIdValidator, getSubCategoryById)
    .put(protect, restrictTo("admin","manager"), updateSubCategoryValidator, updateSubCategoryById)
    .delete(protect, restrictTo("admin"), deleteSubCategoryByIdValidator, deleteSubCategoryById);


module.exports = router;