const SubCategoryModel = require('../models/subCategoryModel.js');
const {deleteOne, getAll, getOne, updateOne, createOne} = require("./handlersFactory");

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
module.exports.getAllSubCategories = getAll(SubCategoryModel, 'SubCategory');

// @route   GET /api/v1/subCategories/:id
// @desc    Get a subCategory by id
// @access  Public
// @params  id
module.exports.getSubCategoryById = getOne(SubCategoryModel,'SubCategory');

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
module.exports.createSubCategory = createOne(SubCategoryModel);

// @route   PUT /api/v1/subCategories/:id
// @desc    Update a subCategory name by id
// @access  Private
// @params  id
// @body    name, parentCategory
module.exports.updateSubCategoryById = updateOne(SubCategoryModel,'SubCategory');

// @route   DELETE /api/v1/subCategories/:id
// @desc    Delete a subCategory by id
// @access  Private
// @params  id
module.exports.deleteSubCategoryById = deleteOne(SubCategoryModel,'SubCategory');

