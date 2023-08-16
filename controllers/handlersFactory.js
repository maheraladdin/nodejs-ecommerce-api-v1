// Desc: Factory functions for handling requests

// require third-party modules
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const sharp = require("sharp");
const bcrypt = require("bcrypt");

// require custom modules
const RequestError = require("../utils/requestError");
const ApiFeatures = require("../utils/ApiFeatures");
const jwt = require("jsonwebtoken");

/**
 * @desc    generate token
 * @param   {Object} payload
 */
module.exports.generateToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES_IN});
}

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
 * @desc    create filter object for mongoose query getAll
 * @param   {string} propertyToFilterBy - The property to filter by
 * @return  {(function(*, *, *): void)|*}
 */
module.exports.createFilterObject = (propertyToFilterBy) =>
    (req, res, next) => {
    const { id } = req.params;
    req.filterObj = id ? { [propertyToFilterBy]: id } : {};
    next();
}

/**
 * @desc    Get all documents
 * @access  Public
 * @param  {Model} Model - The model to get from
 * @return {object} - The response object
 */
module.exports.getAll = (Model ) => asyncHandler(async (req, res) => {

    // filter object
    const filter = req.filterObj ? req.filterObj : {};

    // Create ApiFeatures instance
    const ApiFeaturesInstance = new ApiFeatures(Model.find(filter), req.query)
        .filterByField()
        .searchWithKeyword()
        .sortingByFields()
        .selectFields();

    // number of docs after filtering
    const countDocuments = await Model.countDocuments(ApiFeaturesInstance.mongooseQuery);

    // apply pagination after sort and Filter
    ApiFeaturesInstance.pagination(countDocuments)

    // destructuring mongooseQuery and paginationResult from ApiFeaturesInstance
    const { paginationResult, mongooseQuery } = ApiFeaturesInstance;

    // Execute query
    const documents = await mongooseQuery;

    // Send response
    res.status(200).json({
        status: 'success',
        length: documents.length,
        numberOfDocuments: countDocuments,
        paginationResult,
        documents
    });
});

/**
 * @desc    Get a document by id
 * @access  Public
 * @param  {Model} Model - The model to get from
 * @param  {string} kind - The kind of document
 * @param  {object?} options - The options for get
 * @param  {string?} options.populate - The populate options
 * @param  {string?} options.populate.path - The populate path
 * @param  {string?} options.populate.select - The populate select
 */
module.exports.getOne = (Model,kind = "Document",options ={}) => asyncHandler(async (req, res, next) => {
    // get id from params
    const id = req.params.id || req.user.id;

    // Build query
    const mongooseInitiateQuery = Model.findById(id);

    // check populate options
    if(options.populate) mongooseInitiateQuery.populate({
        path: options.populate.path,
        select: options.populate.select
    });

    // execute query
    const document = await mongooseInitiateQuery;

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
 * @param   {object} req.body - The request body
 * @param   {string} req.body.name - The name of document
 * @param   {string} req.body.title - The title of document
 */
const setSlug = (req) => {
    const {name, title} = req.body;
    if(!name && !title) return;
    req.body.slug = slugify(name || title);
}

/**
 * @desc    set body property to params id
 * @param   {string} propertyToSet - The property to set
 * @param   {object?} options - The options for set
 * @param   {string?} options.paramsToGet - The params to get
 * @param   {boolean?} options.getUserByToken - The flag to get user by token
 * @return  {(function(*, *, *): Promise<void>)|*}
 */
module.exports.setBodyPropertyToParamsId = (propertyToSet,options = {}) => async (req,res,next) => {
    const paramsToGet = (options && options.paramsToGet) || "id";
    if(!req.body[propertyToSet]) req.body[propertyToSet] = req.params[paramsToGet];
    if(!req.body.user && options.getUserByToken) req.body.user = req.user.id;
    next();
}

/**
 * @desc    Create a document
 * @access  Private
 * @param  {Model} Model - The model to create from
 * @param  {object?} options - The options for create
 * @param  {string?} options.message - The message to send in response
 * @param  {boolean?} options.generateToken - The flag to generate token
 * @return {object} - The response object or the created document
 */
module.exports.createOne = (Model,options = {}) => asyncHandler(async (req, res) => {
    // set slug
    await setSlug(req);

    // response object
    const responseObject = {
        status: 'success',
        message: options.message || "Document created successfully",
    }

    // create document
    responseObject.document = await Model.create(req.body);

    responseObject.token = options.generateToken && module.exports.generateToken({id: responseObject.document._id});

    // send response
    res.status(201).json(responseObject);
});

/**
 * @desc    Update a document by id
 * @access  Private
 * @param   {object} req - The request object
 * @param   {object} req.body - The request body
 * @param   {string} req.params.id - The id of document
 * @param   {string} req.user.id - The id of user
 * @param   {object} res - The response object
 * @param   {function} next - The next function
 * @param  {Model} Model - The model to update from
 * @param  {string} kind - The kind of document
 * @param  {object?} options - The options for update
 * @param  {string[]?} options.deleteFromRequestBody - The fields to delete from request body
 * @param  {string[]?} options.selectFromRequestBody - The fields to select from request body
 * @param  {boolean?} options.hashPassword - The flag to hash password
 * @param  {boolean?} options.reActive - The flag to re-active document
 * @param  {boolean?} options.deActive - The flag to de-active document
 * @param   {boolean?} options.roleChanged - The flag to change role
 * @param   {boolean?} options.generateToken - The flag to generate token
 * @param   {boolean?} options.message - The message to send in response
 */
const updateOneHandler = async (req,res,next,Model,kind,options) => {

    // get id from params
    const id = req.params.id || req.user.id;

    // response object
    const response = {
        status: 'success',
        message: options.message || `${kind} updated successfully`,
    };

    // generate token if options.generateToken is true and send it in response
    if(options.generateToken) response.token = module.exports.generateToken({id});

    // delete fields from request body if exists in options.deleteFromRequestBody
    if(options.deleteFromRequestBody) {
        options.deleteFromRequestBody.forEach(field => delete req.body[field]);
    }

    // select fields from request body if exists in options.selectFromRequestBody
    if(options.selectFromRequestBody) {
        const fields = Object.keys(req.body);
        options.selectFromRequestBody.forEach(field => {
            if(!fields.includes(field)) delete req.body[field];
        });
    }

    // Hash password if options.changePassword is true
    if(options.hashPassword) {
        // hash password
        const salt = bcrypt.genSaltSync(10);
        req.body.password = bcrypt.hashSync(req.body.password, salt);
        req.body.passwordChangedAt = Date.now();
        response.message = `${kind} password updated successfully`;
    }

    // re-active document if options.reActive is true
    if(options.reActive) {
        // get active state of user from database
        const activeState = await Model.findById(id).select("active");
        // check if user is already active
        if(activeState.active) throw new RequestError(`${kind} is already active`, 400);
        // re-active user
        activeState.active = true;
        // save active state
        await activeState.save();
        // customize response message
        response.message = `${kind} is reactivated`;
        // return response
        return res.status(200).json(response);
    }

    // re-active document if options.reActive is true
    if(options.deActive) {
        // get active state of user from database
        const activeState = await Model.findById(id).select("active");
        // check if user is already active
        if(!activeState.active) throw new RequestError(`${kind} is already deactivated`, 400);
        // re-active user
        activeState.active = false;
        // save active state
        await activeState.save();
        // customize response message
        response.message = `${kind} is deactivated`;
        // return response
        return res.status(200).json(response);
    }

    // role updated at if role changed
    if(options.roleChanged) {
        // get role state of user from database
        const roleState = await Model.findById(id).select("role");
        // check if role is already changed
        if(req.body.role === roleState.role) throw new RequestError(`${kind} role is already ${req.body.role}`, 400);
        // change role
        roleState.role = req.body.role;
        // set role changed at
        roleState.roleChangedAt = Date.now();
        // save role state
        await roleState.save();
        // customize response message
        response.message = `${kind} role is changed to ${req.body.role}`;
        return res.status(200).json(response);
    }

    // set slug
    await setSlug(req);

    // update document
    const document = await Model.findByIdAndUpdate(id, req.body, { new: true });

    // check if document exists
    if (!document)
        throw new RequestError(`${kind} not found for provided id`, 404);

    // add document to response
    response.document = document;
    // send response
    res.status(200).json(response);

}


/**
 * @desc    Update a document by id
 * @access  Private
 * @param  {Model} Model - The model to update from
 * @param  {string} kind - The kind of document
 * @param  {object?} options - The options for update
 * @param  {string[]?} options.deleteFromRequestBody - The fields to delete from request body
 * @param  {string[]?} options.selectFromRequestBody - The fields to select from request body
 * @param  {boolean?} options.hashPassword - The flag to hash password
 * @param  {boolean?} options.reActive - The flag to re-active document
 * @param  {boolean?} options.deActive - The flag to de-active document
 * @param   {boolean?} options.roleChanged - The flag to change role
 * @param   {boolean?} options.generateToken - The flag to generate token
 * @param   {boolean?} options.message - The message to send in response
 */
module.exports.updateOne = (Model,kind = "Document",options = {}) =>
    asyncHandler(async (req, res,next) => updateOneHandler(req,res,next,Model,kind,options));

/**
    @desc    Delete a category by id
    @access  Private
    @param  {Model} Model - The model to delete from
    @param  {string} kind - The kind of document
    @return {object} - The response object
 */
module.exports.deleteOne = (Model,kind = "Document") => asyncHandler(async (req, res, next) => {
    // get id from params
    const id = req.params.id || req.user._id;

    // delete document
    const document = await Model.findByIdAndDelete(id);

    // check if document exists
    if (!document)
        return next(new RequestError(`No ${kind} found for id: ${id}`, 404));

    res.status(204).send();
});