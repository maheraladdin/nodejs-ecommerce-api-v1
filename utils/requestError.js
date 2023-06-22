// @desc: Custom error class for handling operational request errors
// @params: message, statusCode
// @returns: Error object
// @usage: next(new requestError('Category not found',404));

class requestError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error'; // 400 or 500
    this.isOperational = true;
  }
}

module.exports = requestError;