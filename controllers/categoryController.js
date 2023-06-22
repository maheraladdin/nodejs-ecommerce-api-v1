const Category = require("../models/categoryModel");
const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const requestError = require("../utils/requestError");

// @route   GET /api/v1/categories
// @desc    Get all categories
// @access  Public
// @query   page, limit
// @usage   /api/v1/categories?page=1&limit=5
module.exports.getCategories = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;
    const categories = await Category.find().skip(skip).limit(limit);
    res.status(200).json({
        status: 'success',
        length: categories.length,
        page,
        data: {
            categories,
        },
    });
});

// @route   GET /api/v1/categories/:id
// @desc    Get a category by id
// @access  Public
// @params  id
// @usage   /api/v1/categories/5f7f1f7baf4b0b2b7c7c7c7c
module.exports.getCategoryById = asyncHandler(async (req, res,next) => {
    const { id } = req.params;
    const category = await Category.findById(id);
    if (!category)
        return next(new requestError(`Category not found for id: ${id}`, 404));

    res.status(200).json({
        status: 'success',
        data: {
            category,
        },
    });
});

// @route   POST /api/v1/categories
// @desc    Create a new category
// @access  Private
// @body    name
// @usage   /api/v1/categories
module.exports.createCategory = asyncHandler(async (req, res) => {
    const {name} = req.body;

    const category = await Category.create({
        name,
        slug: slugify(name),
    });

    res.status(201).json({
        status: 'success',
        data: {
            category,
        },
    });

});

// @route   PUT /api/v1/categories/:id
// @desc    Update a category by id
// @access  Private
// @params  id
// @body    name
// @usage   /api/v1/categories/5f7f1f7baf4b0b2b7c7c7c7c
module.exports.updateCategory = asyncHandler(async (req, res,next) => {
    const {name} = req.body;
    const { id } = req.params;

    const category = await Category.findByIdAndUpdate(id, {
        name,
        slug: slugify(name),
    }, { new: true });

    if (!category)
        return next(new requestError(`Category not found for id: ${id}`, 404));

    res.status(200).json({
        status: 'success',
        data: {
            category,
        },
    });

});

// @route   DELETE /api/v1/categories/:id
// @desc    Delete a category by id
// @access  Private
// @params  id
// @usage   /api/v1/categories/5f7f1f7baf4b0b2b7c7c7c7c
module.exports.deleteCategory = asyncHandler(async (req, res,next) => {
    const { id } = req.params;
    const category = await Category.findByIdAndDelete(id);

    if (!category)
        return next(new requestError(`Category not found for id: ${id}`, 404));

    res.status(204).json({
        status: 'success',
        data: null,
    });

});