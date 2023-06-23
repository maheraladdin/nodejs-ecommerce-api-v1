const Brand = require("../models/brandModel");
const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const requestError = require("../utils/requestError");

// @route   GET /api/v1/brands
// @desc    Get all brands
// @access  Public
// @query   page, limit
// @usage   /api/v1/brands?page=1&limit=5
module.exports.getBrands = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;
    const brands = await Brand.find().skip(skip).limit(limit);
    res.status(200).json({
        status: 'success',
        length: brands.length,
        page,
        data: {
            brands,
        },
    });
});

// @route   GET /api/v1/brands/:id
// @desc    Get a brand by id
// @access  Public
// @params  id
// @usage   /api/v1/brands/5f7f1f7baf4b0b2b7c7c7c7c
module.exports.getBrandById = asyncHandler(async (req, res,next) => {
    const { id } = req.params;
    const brand = await Brand.findById(id);
    if (!brand)
        return next(new requestError(`Brand not found for id: ${id}`, 404));

    res.status(200).json({
        status: 'success',
        data: {
            brand,
        },
    });
});

// @route   POST /api/v1/brands
// @desc    Create a new brand
// @access  Private
// @body    name
// @usage   /api/v1/brands
module.exports.createBrand = asyncHandler(async (req, res) => {
    const {name} = req.body;

    const brand = await Brand.create({
        name,
        slug: slugify(name),
    });

    res.status(201).json({
        status: 'success',
        data: {
            brand,
        },
    });

});

// @route   PUT /api/v1/brands/:id
// @desc    Update a brand by id
// @access  Private
// @params  id
// @body    name
// @usage   /api/v1/brands/5f7f1f7baf4b0b2b7c7c7c7c
module.exports.updateBrand = asyncHandler(async (req, res,next) => {
    const {name} = req.body;
    const { id } = req.params;

    const brand = await Brand.findByIdAndUpdate(id, {
        name,
        slug: slugify(name),
    }, { new: true });

    if (!brand)
        return next(new requestError(`Brand not found for id: ${id}`, 404));

    res.status(200).json({
        status: 'success',
        data: {
            brand,
        },
    });

});

// @route   DELETE /api/v1/categories/:id
// @desc    Delete a category by id
// @access  Private
// @params  id
// @usage   /api/v1/categories/5f7f1f7baf4b0b2b7c7c7c7c
module.exports.deleteBrand = asyncHandler(async (req, res,next) => {
    const { id } = req.params;
    const brand = await Brand.findByIdAndDelete(id);

    if (!brand)
        return next(new requestError(`Brand not found for id: ${id}`, 404));

    res.status(204).json({
        status: 'success',
        data: null,
    });

});