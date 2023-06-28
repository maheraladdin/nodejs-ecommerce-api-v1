// Description: Handle product requests.
const { deleteOne, getAll, getOne, updateOne, createOne } = require("./handlersFactory");
const Product = require("../models/productModel");
const upload = require("../middlewares/uploadImageMW");
const sharp = require("sharp");


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
 * @route   POST /api/v1/products/uploadImageCover
 * @desc    Upload a product image cover
 */
module.exports.uploadImages = upload.fields([
        { name: 'imageCover', maxCount: 1 },
        { name: 'images', maxCount: 5 }
]);

module.exports.optimizeImages = async (req, res, next) => {
    if(!req.files) return next();
    const { imageCover, images } = req.files;

    // image cover optimization
    if(imageCover) {
        // fetch buffer
        const imageCoverBuffer = imageCover[0].buffer || images[0].buffer;
        // optimize image cover
          await sharp(imageCoverBuffer)
            .resize(600, 600)
            .toFormat("webp")
            .webp({quality: 90})
            .toBuffer()
            .then(imageCoverBufferAfterOptimization => req.body.imageCover = imageCoverBufferAfterOptimization.toString("base64"));
    }

    // images optimization
    if(images) {
        req.body.images = [];
        // fetch buffers
        const imagesArrayBuffer = images.map(image => image.buffer);
        // optimize images and save them to req.body
        for (const imageBuffer of imagesArrayBuffer) {
            const imageBufferAfterOptimization = await sharp(imageBuffer)
                .resize(600, 600)
                .toFormat("webp")
                .webp({quality: 50})
                .toBuffer();
            req.body.images.push(imageBufferAfterOptimization.toString("base64"));
        }


    }

    next();
}

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