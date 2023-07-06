// Description: Handle subCategory requests.
const {deleteOne, getAll, getOne, updateOne, createOne} = require("./handlersFactory");
const SubCategoryModel = require('../models/subCategoryModel.js');

/**
 * @desc    Use in nested get route to set filter object for getting subCategories
 * @param   {object} req - The request object
 * @param   {object} res - The response object
 * @param   {function} next - The next middleware
 */
module.exports.createFilterObject = (req, res, next) => {
    const { id } = req.params;
    req.filter = id ? { category: id } : {};
    next();
}
/**
 * @desc    Get all subCategories
 * @route   GET /api/v1/subCategories || /api/v1/Categories/:id/subCategories
 * @access  Public
 */
module.exports.getAllSubCategories = getAll(SubCategoryModel, 'SubCategory',{nested: true});
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

