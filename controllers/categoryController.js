const Category = require("../models/categoryModel");
const {deleteOne, getAll, getOne, updateOne, createOne} = require("./handlersFactory");
/**
 * @route   GET /api/v1/categories
 * @desc    Get all categories
 * @access  Public
 */
module.exports.getCategories = getAll(Category);
/**
 * @route   GET /api/v1/categories/:id
 * @desc    Get a category by id
 * @access  Public
*/
module.exports.getCategoryById = getOne(Category,'Category');
/**
 * @route   POST /api/v1/categories
 * @desc    Create a new category
 * @access  Private
*/
module.exports.createCategory = createOne(Category);
/**
 * @route   PUT /api/v1/categories/:id
 * @desc    Update a category by id
 * @access  Private
*/
module.exports.updateCategoryById = updateOne(Category, "category");
/**
 * @route   DELETE /api/v1/categories/:id
 * @desc    Delete a category by id
 * @access  Private
*/
module.exports.deleteCategoryById = deleteOne(Category, "category");