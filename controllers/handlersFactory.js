// Desc: Factory functions for handling requests

// require third-party modules
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const sharp = require("sharp");

// require custom modules
const RequestError = require("../utils/RequestError");
const ApiFeatures = require("../utils/ApiFeatures");

/**
 * @desc    optimize category image
 * @type    {function}
 * @param   {object: {
 *      imageDimensions?: {width?: number,height?: number},
 *      quality?: number,
 *      outputFormat?,
 *      bodyField?: string
 *      }} options - The options for image processing
 */
module.exports.optimizeImage = (options = {}) => asyncHandler(async (req, res, next) => {
    // check if there is no file property in request
    if(!req.file) return next();
    // constants for image processing
    const {buffer} = req.file;
    const imageDimensions = options.imageDimensions || {width: 600, height: 600};
    const quality = options.quality || 90;
    const outputFormat = options.outputFormat || "webp";

    // image processing
    const imageBufferAfterOptimization = await sharp(buffer)
        .resize(imageDimensions.width, imageDimensions.height)
        .toFormat(outputFormat)
        [outputFormat]({quality})
        .toBuffer();

    // constants for request body
    const bodyField = options.bodyField || "image";

    // save optimized image to request body
    req.body[bodyField] = imageBufferAfterOptimization.toString("base64");

    next();
});

/**
 * @desc    Get all documents
 * @access  Public
 * @param  {Model} Model - The model to get from
 * @param  {string?} kind - The kind of document
 * @return {object} - The response object
 */
module.exports.getAll = (Model,kind = "Document") => asyncHandler(async (req, res) => {
    // number of documents in collection
    const countDocuments = await Model.countDocuments();
    // Build query
    const mongooseInitiateQuery = (kind === "SubCategory") ? Model.find(req.filter) : Model.find();

    // Create ApiFeatures instance
    const ApiFeaturesInstance = new ApiFeatures(mongooseInitiateQuery, req.query)
        .pagination(countDocuments)
        .filterByField()
        .searchWithKeyword()
        .sortingByFields()
        .selectFields();

    // destructuring mongooseQuery and paginationResult from ApiFeaturesInstance
    const { paginationResult, mongooseQuery } = ApiFeaturesInstance;

    // Execute query
    const documents = await mongooseQuery;

    // Send response
    res.status(200).json({
        status: 'success',
        length: documents.length,
        paginationResult,
        documents
    });
});

/**
 * @desc    Get a document by id
 * @access  Public
 * @param  {Model} Model - The model to get from
 * @param  {string} kind - The kind of document
 */
module.exports.getOne = (Model,kind = "Document") => asyncHandler(async (req, res, next) => {
    // get id from params
    const { id } = req.params;

    // execute query
    const document = await Model.findById(id);

    // check if document exists
    if (!document)
        return next(new RequestError(`${kind} not found for id: ${id}`, 404));

    res.status(200).json({
        status: 'success',
        document
    });
});

/**
 * @desc    set slug for document
 * @param   {object} req - The request object
 */
const setSlug = (req) => {
    const {name, title} = req.body;
    if(!name && !title) return;
    req.body.slug = slugify(name || title);
}

/**
 * @desc    Create a document
 * @access  Private
 * @param  {Model} Model - The model to create from
 */
module.exports.createOne = (Model) => asyncHandler(async (req, res) => {
    // set slug
    await setSlug(req);

    // create document
    const document = await Model.create(req.body);

    res.status(201).json({
        status: 'success',
        document,
    });
});

/**
 * @desc    Update a document by id
 * @access  Private
 * @param  {Model} Model - The model to update from
 * @param  {string} kind - The kind of document
 */
module.exports.updateOne = (Model,kind = "Document") => asyncHandler(async (req, res, next) => {
    // set slug
    await setSlug(req);

    // get id from params
    const { id } = req.params;

    // update document
    const document = await Model.findByIdAndUpdate(id, req.body, { new: true });

    // check if document exists
    if (!document)
        return next(new RequestError(`${kind} not found for id: ${id}`, 404));

    res.status(200).json({
        status: 'success',
        document
    });
});

/**
    @desc    Delete a category by id
    @access  Private
    @param  {Model} Model - The model to delete from
    @param  {string} kind - The kind of document
    @return {object} - The response object
 */
module.exports.deleteOne = (Model,kind = "Document") => asyncHandler(async (req, res, next) => {
    // get id from params
    const { id } = req.params;

    // delete document
    const document = await Model.findByIdAndDelete(id);

    // check if document exists
    if (!document)
        return next(new RequestError(`No ${kind} found for id: ${id}`, 404));

    res.status(204).send();
});