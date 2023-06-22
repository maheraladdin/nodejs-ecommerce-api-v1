const express = require("express");

// mergeParams: true is required to access params from parent router
const router = express.Router({ mergeParams: true });

// require utils
const { createSubCategory,
        getAllSubCategories,
        getSubCategoryById,
        updateSubCategoryNameById,
        updateSubCategoryParentCategoryById,
        deleteSubCategoryById } = require("../controllers/subCategoryController");

// require validators
const { createSubCategoryValidator,
        getSubCategoryByIdValidator,
        updateSubCategoryNameByIdValidator,
        updateSubCategoryParentCategoryByIdValidator,
        deleteSubCategoryByIdValidator } = require("../utils/Validators/SubCategoryValidators");

// routes
router.route("/")
    .post(createSubCategoryValidator, createSubCategory)
    .get(getAllSubCategories);

router.route("/:id")
    .get(getSubCategoryByIdValidator, getSubCategoryById)
    .put(updateSubCategoryNameByIdValidator, updateSubCategoryNameById)
    .delete(deleteSubCategoryByIdValidator, deleteSubCategoryById);

router.route("/:id/parentCategory")
    .put(updateSubCategoryParentCategoryByIdValidator, updateSubCategoryParentCategoryById);


module.exports = router;