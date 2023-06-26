const Product = require("../models/productModel");
const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const requestError = require("../utils/requestError");
const apiFeatures = require("../utils/apiFeatures");

/**
@route   GET /api/v1/products
@desc    Get all products
@access  Public
@query   page, limit, sort, select, title, description, quantity, sold, price, discountedPrice, colors, images, imageCover, category, subCategory, brand, ratingsAverage, ratingsQuantity
@note    Advanced filtering with operators ($gt, $gte, $lt, $lte, $eq)
 @usage http://localhost:5000/api/v1/products?title[eq]=product1&price[gte]=100&sort=-price&select=title,price&limit=2&page=2&category=5f9a1b7b3b4b0e1f1c9b3b0d
 */
module.exports.getProducts = asyncHandler(async (req, res) => {
    // number of documents in collection
    const countDocuments = await Product.countDocuments();
    // Build query
    const apiFeaturesInstance = new apiFeatures(Product.find(), req.query)
        .pagination(countDocuments)
        .filterByField()
        .searchWithKeyword()
        .sortingByFields()
        .selectFields();

    // Execute query
    const { paginationResult, mongooseQuery } = apiFeaturesInstance;
    const products = await mongooseQuery;

    // Send response
    res.status(200).json({
        status: 'success',
        length: products.length,
        paginationResult,
        data: {
            products,
        },
    });
});

/**
@route   GET /api/v1/products/:id
@desc    Get a product by id
@access  Public
@params  id
 */
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

/**
@route   POST /api/v1/products
@desc    Create a new product
@access  Private
@body    title, description, price, discountedPrice, quantity, images, category, subCategory, brand, colors
@note    slug is generated from title
 */
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

/**
@route   PUT /api/v1/categories/:id
@desc    Update a category by id
@access  Private
@params  id
 */
module.exports.updateProductById = asyncHandler(async (req, res,next) => {
    // if body is empty then return error
    if (Object.keys(req.body).length === 0)
        return next(new requestError('Body can not be empty', 400));
    // if title is updated then update slug
    req.body.title && (() => req.body.slug = slugify(req.body.title))();
    // get id from params
    const { id } = req.params;
    // find category by id and update
    const product = await Product.findByIdAndUpdate(id, req.body, { new: true });
    // if category not found then return error
    if (!product)
        return next(new requestError(`Product not found for id: ${id}`, 404));
    // else return updated category
    res.status(200).json({
        status: 'success',
        data: {
            product,
        },
    });

});

/**
@route   DELETE /api/v1/categories/:id
@desc    Delete a category by id
@access  Private
@params  id
 */
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