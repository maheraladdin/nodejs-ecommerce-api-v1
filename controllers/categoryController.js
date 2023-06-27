// Description: Handle category requests.
const Category = require("../models/categoryModel");
const {deleteOne, getAll, getOne, updateOne, createOne, optimizeImage} = require("./handlersFactory");
const upload = require("../middlewares/uploadImageMW");


/**
 * @route   GET /api/v1/categories
 * @desc    Get all categories
 * @access  Public
 * @type    {object}
 */
module.exports.getCategories = getAll(Category);
/**
 * @route   GET /api/v1/categories/:id
 * @desc    Get a category by id
 * @access  Public
 * @type    {object}
*/
module.exports.getCategoryById = getOne(Category,'Category');

/**
 * @desc    optimize category image
 * @type    {object}
 */
module.exports.optimizeCategoryImage = optimizeImage("Category",{path: "uploads/categories"});

/**
 * @desc    Middleware to upload a category image
 * @type    {object}
 */
module.exports.uploadCategoryImage = upload.single("image");

/**
 * @route   POST /api/v1/categories
 * @desc    Create a new category
 * @access  Private
 * @type    {object}
*/
module.exports.createCategory = createOne(Category);
/**
 * @route   PUT /api/v1/categories/:id
 * @desc    Update a category by id
 * @access  Private
 * @type    {object}
*/
module.exports.updateCategoryById = updateOne(Category, "category");
/**
 * @route   DELETE /api/v1/categories/:id
 * @desc    Delete a category by id
 * @access  Private
 * @type    {object}
*/
module.exports.deleteCategoryById = deleteOne(Category, "category");