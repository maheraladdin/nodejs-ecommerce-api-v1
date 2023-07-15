// Description: Handle category requests.
const {deleteOne, getAll, getOne, updateOne, createOne, optimizeImage} = require("./handlersFactory");
const upload = require("../middlewares/uploadImageMW");
const Category = require("../models/categoryModel");


/*
 * @route   GET /api/v1/categories
 * @desc    Get all categories
 * @access  Public
 * @query   page, limit, sort, fields, keyword
 */
module.exports.getCategories = getAll(Category);

/*
 * @route   GET /api/v1/categories/:id
 * @desc    Get a category by id
 * @access  Public
 * @params  id - category id
*/
module.exports.getCategoryById = getOne(Category,'Category');

/*
 * @desc    optimize category image
 * @type    {object}
 */
module.exports.optimizeCategoryImage = optimizeImage();

/*
 * @desc    Middleware to upload a category image
 * @type    {object}
 */
module.exports.uploadCategoryImage = upload.single("image");

/*
 * @route   POST /api/v1/categories
 * @desc    Create a new category
 * @access  Private (admin, manager)
 * @body    name, image
*/
module.exports.createCategory = createOne(Category);

/*
 * @route   PUT /api/v1/categories/:id
 * @desc    Update a category by id
 * @access  Private (admin, manager)
 * @params  id - category id
 * @body    name, image
*/
module.exports.updateCategoryById = updateOne(Category, "category");

/*
 * @route   DELETE /api/v1/categories/:id
 * @desc    Delete a category by id
 * @access  Private (admin)
 * @params  id - category id
*/
module.exports.deleteCategoryById = deleteOne(Category, "category");