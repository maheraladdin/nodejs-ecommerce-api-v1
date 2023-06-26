const Brand = require("../models/brandModel");
const {deleteOne, getAll, getOne, updateOne, createOne} = require("./handlersFactory");

/**
 * @route   GET /api/v1/brands
 * @desc    Get all brands
 * @access  Public
*/
module.exports.getBrands = getAll(Brand);

/**
 * @route   GET /api/v1/brands/:id
 * @desc    Get a brand by id
 * @access  Public
*/
module.exports.getBrandById = getOne(Brand,'Brand');

/**
 * @route   POST /api/v1/brands
 * @desc    Create a new brand
 * @access  Private
*/
module.exports.createBrand = createOne(Brand);

/**
 * @route   PUT /api/v1/brands/:id
 * @desc    Update a brand by id
 * @access  Private
*/
module.exports.updateBrandById = updateOne(Brand, "Brand");

/**
 * @route   DELETE /api/v1/categories/:id
 * @desc    Delete a category by id
 * @access  Private
*/
module.exports.deleteBrandById = deleteOne(Brand, "Brand");