// Description: Handle product requests.
const { deleteOne, getAll, getOne, updateOne, createOne } = require("./handlersFactory");
const Product = require("../models/productModel");
const upload = require("../middlewares/uploadImageMW");
const sharp = require("sharp");

/*
 * @route   GET /api/v1/products
 * @desc    Get all products
 * @access  Public
 */
module.exports.getProducts = getAll(Product);

/*
 * @route   GET /api/v1/products/:id
 * @desc    Get a product by id
 * @access  Public
 */
module.exports.getProductById = getOne(Product, 'Product', { populate: { path: "reviews", select: "review rating user" } });

/*
 * @route   POST /api/v1/products/uploadImageCover
 * @desc    Upload a product image cover
 * @access  Private (admin, manager)
 */
module.exports.uploadImages = upload.fields([
        { name: 'imageCover', maxCount: 1 },
        { name: 'images', maxCount: 5 }
]);

/**
 * @desc    optimize product image cover and images
 * @param   {object} req - request object
 * @param   {object} req.files - files object
 * @param   {object} req.files.imageCover - image cover from multer
 * @param   {object} req.files.images - images from multer
 * @param   {object} req.body - body object
 * @param   {object} req.body.imageCover - image cover
 * @param   {object} req.body.images - images
 * @param   {object} res - response object
 * @param   {function} next - move to next middleware
 */
module.exports.optimizeImages = async (req, res, next) => {
    if(!req.files) return next();
    const { imageCover, images } = req.files;

    // image cover optimization
    if(imageCover) {
        // fetch buffer
        const imageCoverBuffer = imageCover[0].buffer || images[0].buffer;
        // constants for image cover
        const { width, height } = { width: 2000, height: 1333 };
        const outputFormat = "webp";
        const quality = 90;
        // optimize image cover
        const imageCoverBufferAfterOptimization = await sharp(imageCoverBuffer)
            .resize(width, height)
            .toFormat(outputFormat)
            [outputFormat]({quality})
            .toBuffer();

        req.body.imageCover = imageCoverBufferAfterOptimization.toString("base64");
    }

    // images optimization
    if(images) {
        req.body.images = [];
        // fetch buffers
        const imagesArrayBuffer = images.map(image => image.buffer);
        // constants for image cover
        const { width, height } = { width: 2000, height: 1333 };
        const outputFormat = "webp";
        const quality = 90;
        // optimize images and save them to req.body
        for (const imageBuffer of imagesArrayBuffer) {
            const imageBufferAfterOptimization = await sharp(imageBuffer)
                .resize(width, height)
                .toFormat(outputFormat)
                [outputFormat]({quality})
                .toBuffer();
            req.body.images.push(imageBufferAfterOptimization.toString("base64"));
        }


    }

    next();
}

/*
 * @route   POST /api/v1/products
 * @desc    Create a new product
 * @access  Private (admin, manager)
 */
module.exports.createProduct = createOne(Product);

/*
 * @route   PUT /api/v1/categories/:id
 * @desc    Update a category by id
 * @access  Private (admin, manager)
 */
module.exports.updateProductById = updateOne(Product, 'Product');

/*
 * @route   DELETE /api/v1/categories/:id
 * @desc    Delete a category by id
 * @access  Private (admin)
 */
module.exports.deleteProductById = deleteOne(Product,'Product');