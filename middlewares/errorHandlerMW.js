// @desc: Error handler middleware
// @usage: use this middleware at the end of all routes

const RequestError = require("../utils/RequestError");

/**
 * @desc: Error handler middleware
 * @param {object} err - error object {statusCode, status, message}
 * @param {number} err.statusCode - status code of error
 * @param {string} err.status - status of error
 * @param {object} req - request object
 * @param {object} res - response object
 * @param {function} next - next function
 * @ignore next - have to pass next function to use this middleware as error handler
 */
module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error'; // 400 or 500
    process.env.NODE_ENV === 'development' ? sendErrorDev(err, res) : sendErrorProd(err, res);
}

/**
 * @desc: This function is used to send error in development mode
 * @param {object} err - error object {statusCode, status, message}
 * @param {number} err.statusCode - status code of error
 * @param {string} err.status - status of error
 * @param {string} err.message - message of error
 * @param {object} err.stack - stack of error
 * @param {object} res - response object
 * @return {*}
 */
const sendErrorDev = (err, res) => {
    return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        error: err,
        stack: err.stack
    })
}

/**
 * @desc: This function is used to send error in production mode
 * @param {object} err - error object {statusCode, status, message}
 * @param {number} err.statusCode - status code of error
 * @param {string} err.status - status of error
 * @param {string} err.message - message of error
 * @param {object} err.name - name of error
 * @param {object} res - response object
 * @return {*}
 */
const sendErrorProd = (err, res) => {
    // customise error messages
    (err.name === "JsonWebTokenError") && (_ => err = handleInvalidSignatureError())();
    (err.name === "TokenExpiredError") && (_ => err = handleTokenExpiredError())();

    // send error msg to client
    return res.status(err.statusCode).json({
        status: err.status,
        message: err.message
    })
}

/**
 * @desc: This function is used to handle invalid signature error
 * @return {RequestError}
 */
const handleInvalidSignatureError = ()=>  new RequestError("Invalid token. Please login again..", 401);

/**
 * @desc: This function is used to handle token expired error
 * @return {RequestError}
 */
const handleTokenExpiredError = ()=>  new RequestError("Your token has expired. Please login again..", 401);
