const SubCategoryModel = require('../models/subCategoryModel.js');
const CategoryModel = require('../models/categoryModel.js');
const asyncHandler = require('express-async-handler');
const requestError = require('../utils/requestError.js');
const slugify = require('slugify');

// populate parentCategory
// const populateParentCategory = {
//     path: 'parentCategory',
//     select: 'name -_id',
// };

// @route   GET /api/v1/subCategories || /api/v1/Categories/:id/subCategories
// @desc    Get all subCategories
// @access  Public
module.exports.getAllSubCategories = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;
    const { id } = req.params;

    // if parentCategory id is provided in params, get subCategories by parentCategory id
    let filter = id ? { parentCategory: id } : {};

    const subCategories = await SubCategoryModel.find(filter).skip(skip).limit(limit);
        // .populate(populateParentCategory);

    res.status(200).json({
        status: 'success',
        length: subCategories.length,
        page,
        data: {
            subCategories,
        },
    });
});

// @route   GET /api/v1/subCategories/:id
// @desc    Get a subCategory by id
// @access  Public
module.exports.getSubCategoryById = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const subCategory = await SubCategoryModel.findById(id)
        // .populate(populateParentCategory);

    if (!subCategory)
        return next(new requestError(`SubCategory not found for id: ${id}`, 404));

    res.status(200).json({
        status: 'success',
        data: {
            subCategory,
        },
    });
});

// @route   POST /api/v1/subCategories
// @desc    Create a new subCategory
// @access  Private
// @body    name, parentCategory
module.exports.createSubCategory = asyncHandler(async (req, res, next) => {
    const {name, parentCategory} = req.body;

    // check if parentCategory already exists
    const parentCategoryExists = await CategoryModel.exists({ _id: parentCategory });

    if (!parentCategoryExists)
        return next(new requestError(`parent Category not exists for id: ${parentCategory}`, 404));

    const subCategory = await SubCategoryModel.create({
        name,
        slug: slugify(name),
        parentCategory
    });

    res.status(201).json({
        status: 'success',
        data: {
            subCategory,
        },
    });

});

// @route   PUT /api/v1/subCategories/:id
// @desc    Update a subCategory name by id
// @access  Private
// @params  id
// @body    name
module.exports.updateSubCategoryNameAndSubCategoryParentCategoryById = asyncHandler(async (req, res, next) => {
    // get name and parentCategory from body
    const {name, parentCategory} = req.body;
    // get subcategory id from params
    const { id } = req.params;

    // check if parentCategory already exists
    const parentCategoryExists = await CategoryModel.exists({ _id: parentCategory });

    if (!parentCategoryExists)
        return next(new requestError(`there is no Category exists for id: ${parentCategory}`, 404));

    // update subCategory
    const subCategory = await SubCategoryModel.findByIdAndUpdate(
        id,
        {
            name,
            slug: slugify(name),
            parentCategory
        },
        {new: true}
    )
        // .populate(populateParentCategory);

    // check if subCategory exists
    if (!subCategory)
        return next(new requestError(`SubCategory not found for id: ${id}`, 404));

    // return response
    res.status(200).json({
        status: 'success',
        data: {
            subCategory,
        },
    });
});

// @route   DELETE /api/v1/subCategories/:id
// @desc    Delete a subCategory by id
// @access  Private
// @params  id
module.exports.deleteSubCategoryById = asyncHandler(async (req, res, next) => {
    const {id} = req.params;
    const subCategory = await SubCategoryModel.findByIdAndDelete(id);

    if (!subCategory)
        return next(new requestError(`SubCategory not found for id: ${id}`, 404));

    res.status(204).json({
        status: 'success',
        data: null,
    });
});

