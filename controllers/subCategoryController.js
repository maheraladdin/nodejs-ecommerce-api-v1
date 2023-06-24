const SubCategoryModel = require('../models/subCategoryModel.js');
const asyncHandler = require('express-async-handler');
const requestError = require('../utils/requestError.js');
const slugify = require('slugify');

// populate parentCategory
// const populateCategory = {
//     path: 'category',
//     select: 'name -_id',
// };

// @desc    Create a filter object for getting subCategories
// @usage   use this middleware in routes to create a filter object for getting subCategories
// @params  id
module.exports.createFilterObject = (req, res, next) => {
    const { id } = req.params;
    req.filter = id ? { category: id } : {};
    next();
}

// @route   GET /api/v1/subCategories || /api/v1/Categories/:id/subCategories
// @desc    Get all subCategories
// @access  Public
// @query   page, limit
module.exports.getAllSubCategories = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const subCategories = await SubCategoryModel.find(req.filter).skip(skip).limit(limit);
        // .populate(populateCategory);

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
// @params  id
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

// @desc    if parentCategory doesn't exist in body then set parentCategory to id from params
// @usage   use this middleware in routes to set parentCategory to id from params if parentCategory doesn't exist in body
// @params  id
module.exports.setParentCategoryToBody = async (req,res,next) => {
    if(!req.body.category) req.body.category = req.params.id;
    next();
}

// @route   POST /api/v1/subCategories
// @desc    Create a new subCategory
// @access  Private
// @body    name, parentCategory
module.exports.createSubCategory = asyncHandler(async (req, res) => {

    // get name and parentCategory from body
    const {name, category} = req.body;

    const subCategory = await SubCategoryModel.create({
        name,
        slug: slugify(name),
        category
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
// @body    name, parentCategory
module.exports.updateSubCategoryById = asyncHandler(async (req, res, next) => {
    // check if body is empty
    if (Object.keys(req.body).length === 0)
        return next(new requestError('Body is empty you have to send name or category id in body', 400));
    // get name from body
    const {name} = req.body;
    // get subcategory id from params
    const { id } = req.params;

    // if name exists then set slug to slugify(name)
    if(name) req.body.slug = slugify(name);

    // update subCategory
    const subCategory = await SubCategoryModel.findByIdAndUpdate(id, req.body,
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

