const asyncHandler = require("express-async-handler");
const requestError = require("../utils/requestError");
const apiFeatures = require("../utils/apiFeatures");
const slugify = require("slugify");
const {v4: uuidv4} = require("uuid");
const sharp = require("sharp");

/**
 * @desc    optimize category image
 * @type    {function}
 * @param   {string} document - The document name
 * @param   {object: {
 *      path: string,
 *      imageDimensions?: {width: number,height: number},
 *      quality?: number,
 *      outputFormat?
 *      }} options - The options for image processing
 */
module.exports.optimizeImage = (document = "document",options) => asyncHandler(async (req, res, next) => {

    // constants for image processing
    const {buffer} = req.file;
    const imageDimensions = options.imageDimensions || {width: 600, height: 600};
    const quality = options.quality || 90;
    const outputFormat = options.outputFormat || "webp";
    const fileName = `${document}-${uuidv4()}-${Date.now()}.${outputFormat}`;
    const path = `${options.path}/${fileName}`;

    // image processing
    await sharp(buffer)
        .resize(imageDimensions.width, imageDimensions.height)
        .toFormat(outputFormat)
        [outputFormat]({quality})
        .toFile(path);

    // save image name into database
    req.body.image = fileName;

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

    // Create apiFeatures instance
    const apiFeaturesInstance = new apiFeatures(mongooseInitiateQuery, req.query)
        .pagination(countDocuments)
        .filterByField()
        .searchWithKeyword()
        .sortingByFields()
        .selectFields();

    // destructuring mongooseQuery and paginationResult from apiFeaturesInstance
    const { paginationResult, mongooseQuery } = apiFeaturesInstance;

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
        return next(new requestError(`${kind} not found for id: ${id}`, 404));

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
        return next(new requestError(`${kind} not found for id: ${id}`, 404));

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
        return next(new requestError(`No ${kind} found for id: ${id}`, 404));

    res.status(204).send();
});