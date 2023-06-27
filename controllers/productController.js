// Description: Handle product requests.
const { deleteOne, getAll, getOne, updateOne, createOne } = require("./handlersFactory");
const Product = require("../models/productModel");

/**
 * @route   GET /api/v1/products
 * @desc    Get all products
 * @access  Public
 * @example http://localhost:5000/api/v1/products?title[eq]=product1&price[gte]=100&sort=-price&select=title,price&limit=2&page=2&category=5f9a1b7b3b4b0e1f1c9b3b0d
 */
module.exports.getProducts = getAll(Product);

/**
 * @route   GET /api/v1/products/:id
 * @desc    Get a product by id
 * @access  Public
 */
module.exports.getProductById = getOne(Product, 'Product');

/**
 * @route   POST /api/v1/products
 * @desc    Create a new product
 * @access  Private
 */
module.exports.createProduct = createOne(Product);

/**
 * @route   PUT /api/v1/categories/:id
 * @desc    Update a category by id
 * @access  Private
 */
module.exports.updateProductById = updateOne(Product, 'Product');

/**
 * @route   DELETE /api/v1/categories/:id
 * @desc    Delete a category by id
 * @access  Private
 */
module.exports.deleteProductById = deleteOne(Product,'Product');