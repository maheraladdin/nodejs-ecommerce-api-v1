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
        updateSubCategoryNameAndSubCategoryParentCategoryById,
        deleteSubCategoryById } = require("../controllers/subCategoryController");

// require utils validators
const { createSubCategoryValidator,
        getSubCategoryByIdValidator,
        updateSubCategoryNameAndSubCategoryParentCategoryByIdValidator,
        deleteSubCategoryByIdValidator } = require("../utils/Validators/SubCategoryValidators");

// routes
router.route("/")
    .post(setParentCategoryToBody, createSubCategoryValidator, createSubCategory)
    .get(createFilterObject, getAllSubCategories);

router.route("/:id")
    .get(getSubCategoryByIdValidator, getSubCategoryById)
    .put(updateSubCategoryNameAndSubCategoryParentCategoryByIdValidator, updateSubCategoryNameAndSubCategoryParentCategoryById)
    .delete(deleteSubCategoryByIdValidator, deleteSubCategoryById);


module.exports = router;