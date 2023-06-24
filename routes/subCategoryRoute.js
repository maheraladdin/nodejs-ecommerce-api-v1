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
        deleteSubCategoryByIdValidator } = require("../utils/Validators/SubCategoryValidators");

// require middlewares
const categoryExists = require('../middlewares/categoryExists.js');

// routes
router.route("/")
    .post(setParentCategoryToBody, createSubCategoryValidator, categoryExists, createSubCategory)
    .get(createFilterObject, getAllSubCategories);

router.route("/:id")
    .get(getSubCategoryByIdValidator, getSubCategoryById)
    .put(updateSubCategoryValidator, categoryExists, updateSubCategoryById)
    .delete(deleteSubCategoryByIdValidator, deleteSubCategoryById);


module.exports = router;