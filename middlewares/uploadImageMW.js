const requestError = require("../utils/requestError");
// const { v4: uuidv4 } = require('uuid');
const multer = require("multer");

// storage configuration
// 1) multer Disk Storage
// use if you want to store files without any image processing

/**
 * @desc    Destination for multer
 * @param   {object} req - request object
 * @param   {object} file - uploaded file object
 * @param   {function} cb - callback function
 * @type    {function}
 */
// const destination = (req, file, cb) => {
//     const path = "uploads/categories";
//     cb(null, path);
// }


/**
 * @desc    Filename for multer
 * @param   {object} req - request object
 * @param   {object} file - uploaded file object
 * @param   {function} cb - callback function
 * @type    {function}
 */
// const filename = (req, file, cb) => {
//     const fileExtension = file.mimetype.split("/")[1];
//     const fileName = `category-${uuidv4()}-${Date.now()}.${fileExtension}`;
//     cb(null, fileName);
// }

/**
 * @desc    Multer Disk storage configuration
 * @type    {object}}
 */
// const storage = multer.diskStorage({destination, filename});

// 2) multer Memory Storage
// use if you want to store files in memory after apply image processing on them

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
    const fileTypeError = new requestError("Please upload only images", 400);
    cb(isImage ? null : fileTypeError, isImage);
}

/**
 * @desc    create multer instance
 */
module.exports = multer({storage, fileFilter});