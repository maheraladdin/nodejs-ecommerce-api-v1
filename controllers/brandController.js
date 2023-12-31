// Description: Handle brand requests.
const {deleteOne, getAll, getOne, updateOne, createOne, optimizeImage} = require("./handlersFactory");
const upload = require("../middlewares/uploadImageMW");
const Brand = require("../models/brandModel");

/*
 * @route   GET /api/v1/brands
 * @desc    Get all brands
 * @access  Public
*/
module.exports.getBrands = getAll(Brand);

/*
 * @route   GET /api/v1/brands/:id
 * @desc    Get a brand by id
 * @access  Public
 * @params  id - brand id
*/
module.exports.getBrandById = getOne(Brand,'Brand');

/*
 * @desc    optimize brand image
 * @type    {object}
 */
module.exports.optimizeBrandImage = optimizeImage();

/*
 * @desc    Middleware to upload a brand image
 * @type    {object}
 */
module.exports.uploadBrandImage = upload.single("image");


/*
 * @route   POST /api/v1/brands
 * @desc    Create a new brand
 * @access  Private (admin, manager)
 * @body    name, image
*/
module.exports.createBrand = createOne(Brand);

/*
 * @route   PUT /api/v1/brands/:id
 * @desc    Update a brand by id
 * @access  Private (admin, manager)
 * @params  id - brand id
 * @body    name, image
*/
module.exports.updateBrandById = updateOne(Brand, "Brand");

/*
 * @route   DELETE /api/v1/brands/:id
 * @desc    Delete a brand by id
 * @access  Private (admin)
 * @params  id - brand id
*/
module.exports.deleteBrandById = deleteOne(Brand, "Brand");