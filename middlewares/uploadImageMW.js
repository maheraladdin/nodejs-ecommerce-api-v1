// Purpose: Multer middleware for uploading one image
const RequestError = require("../utils/RequestError");
const multer = require("multer");

/**
 * @desc    Multer Memory Storage
 */
const storage = multer.memoryStorage();

/**
 * @desc    Multer file filter
 * @param {object} req - request object
 * @param {object} file - uploaded file object
 * @param {function} cb - callback function
 */
const fileFilter = (req, file, cb) => {
    const isImage = file.mimetype.startsWith("image");
    const fileTypeError = new RequestError("Please upload only images", 400);
    cb(isImage ? null : fileTypeError, isImage);
}

/**
 * @desc    create multer instance
 */
module.exports = multer({storage, fileFilter});