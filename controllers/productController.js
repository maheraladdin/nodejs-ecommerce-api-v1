const Product = require("../models/productModel");
const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const requestError = require("../utils/requestError");

// @route   GET /api/v1/products
// @desc    Get all products
// @access  Public
// @query   page, limit
module.exports.getProducts = asyncHandler(async (req, res) => {
    // pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const products = await Product.find().skip(skip).limit(limit).populate({
        path: 'category',
        select: 'name -_id',
    });
    res.status(200).json({
        status: 'success',
        length: products.length,
        page,
        data: {
            products,
        },
    });
});

// @route   GET /api/v1/products/:id
// @desc    Get a product by id
// @access  Public
// @params  id
module.exports.getProductById = asyncHandler(async (req, res,next) => {
    const { id } = req.params;
    const product = await Product.findById(id).populate({
        path: 'category',
        select: 'name -_id',
    });
    if (!product)
        return next(new requestError(`Product not found for id: ${id}`, 404));

    res.status(200).json({
        status: 'success',
        data: {
            product,
        },
    });
});

// @route   POST /api/v1/products
// @desc    Create a new product
// @access  Private
module.exports.createProduct = asyncHandler(async (req, res) => {
    req.body.slug = slugify(req.body.title);
    const product = await Product.create(req.body);

    res.status(201).json({
        status: 'success',
        data: {
            product,
        },
    });

});

// @route   PUT /api/v1/categories/:id
// @desc    Update a category by id
// @access  Private
// @params  id
module.exports.updateProductById = asyncHandler(async (req, res,next) => {
    req.body.title && (() => req.body.slug = slugify(req.body.title))();
    const { id } = req.params;

    const product = await Product.findByIdAndUpdate(id, req.body, { new: true });

    if (!product)
        return next(new requestError(`Product not found for id: ${id}`, 404));

    res.status(200).json({
        status: 'success',
        data: {
            product,
        },
    });

});

// @route   DELETE /api/v1/categories/:id
// @desc    Delete a category by id
// @access  Private
// @params  id
module.exports.deleteProductById = asyncHandler(async (req, res,next) => {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);

    if (!product)
        return next(new requestError(`Product not found for id: ${id}`, 404));

    res.status(204).json({
        status: 'success',
        data: null,
    });
});