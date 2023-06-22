const express = require("express");

// mergeParams: true is required to access params from parent router
const router = express.Router({ mergeParams: true });

// require utils
const { createSubCategory,
        setParentCategoryToBody,
        getAllSubCategories,
        createFilterObject,
        getSubCategoryById,
        updateSubCategoryNameAndSubCategoryParentCategoryById,
        deleteSubCategoryById } = require("../controllers/subCategoryController");

// require validators
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