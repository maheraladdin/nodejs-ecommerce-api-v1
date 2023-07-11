// Purpose: subCategory routes
// require express
const express = require("express");
// require router
// mergeParams: true is required to access params from parent router
const router = express.Router({ mergeParams: true });

// require controllers
const { createSubCategory,
        getAllSubCategories,
        getSubCategoryById,
        updateSubCategoryById,
        deleteSubCategoryById } = require("../controllers/subCategoryController");

const { createFilterObject, setBodyPropertyToParamsId } = require("../controllers/handlersFactory");

// require utils validators
const { createSubCategoryValidator,
        getSubCategoryByIdValidator,
        updateSubCategoryValidator,
        deleteSubCategoryByIdValidator } = require("../utils/ValidationLayer/Validators/subCategoryValidators");

// require auth controllers
const { protect, restrictTo } = require("../controllers/authController");

// routes
router.route("/")
    .post(protect, restrictTo("admin","manager"), setBodyPropertyToParamsId("category"), createSubCategoryValidator, createSubCategory)
    .get(createFilterObject("category"), getAllSubCategories);

router.route("/:id")
    .get(getSubCategoryByIdValidator, getSubCategoryById)
    .put(protect, restrictTo("admin","manager"), updateSubCategoryValidator, updateSubCategoryById)
    .delete(protect, restrictTo("admin"), deleteSubCategoryByIdValidator, deleteSubCategoryById);


module.exports = router;