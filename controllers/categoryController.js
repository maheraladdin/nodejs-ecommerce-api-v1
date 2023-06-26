const Category = require("../models/categoryModel");
const {deleteOne, getAll, getOne, updateOne, createOne} = require("./handlersFactory");

// @route   GET /api/v1/categories
// @desc    Get all categories
// @access  Public
// @query   page, limit
module.exports.getCategories = getAll(Category);

// @route   GET /api/v1/categories/:id
// @desc    Get a category by id
// @access  Public
// @params  id
module.exports.getCategoryById = getOne(Category,'Category');

// @route   POST /api/v1/categories
// @desc    Create a new category
// @access  Private
// @body    name
module.exports.createCategory = createOne(Category);

// @route   PUT /api/v1/categories/:id
// @desc    Update a category by id
// @access  Private
// @params  id
// @body    name
module.exports.updateCategoryById = updateOne(Category, "category");

// @route   DELETE /api/v1/categories/:id
// @desc    Delete a category by id
// @access  Private
// @params  id
// @usage   /api/v1/categories/5f7f1f7baf4b0b2b7c7c7c7c
module.exports.deleteCategoryById = deleteOne(Category, "category");