// Description: Handle subCategory requests.
const {deleteOne, getAll, getOne, updateOne, createOne} = require("./handlersFactory");
const SubCategoryModel = require('../models/subCategoryModel.js');

/**
 * @desc    Get all subCategories
 * @route   GET /api/v1/subCategories || /api/v1/Categories/:id/subCategories
 * @access  Public
 */
module.exports.getAllSubCategories = getAll(SubCategoryModel);
/**
 * @desc    Get a subCategory by id
 * @route   GET /api/v1/subCategories/:id
 * @access  Public
 */
module.exports.getSubCategoryById = getOne(SubCategoryModel,'SubCategory');

/**
 * @desc    Create a new subCategory
 * @route   POST /api/v1/Categories/:id/subCategories || /api/v1/subCategories
 * @access  Private (admin, manager)
 */
module.exports.createSubCategory = createOne(SubCategoryModel);

/**
 * @route   PUT /api/v1/subCategories/:id
 * @desc    Update a subCategory name by id
 * @access  Private (admin, manager)
 */
module.exports.updateSubCategoryById = updateOne(SubCategoryModel,'SubCategory');

/**
 * @route   DELETE /api/v1/subCategories/:id
 * @desc    Delete a subCategory by id
 * @access  Private (admin)
 */
module.exports.deleteSubCategoryById = deleteOne(SubCategoryModel,'SubCategory');

