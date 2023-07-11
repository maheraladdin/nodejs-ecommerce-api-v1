/**
 * @class RequestError
 * @extends Error
 */
class RequestError extends Error {
  /**
   * @constructor
   * @param {string} message
   * @param {number} statusCode
   */
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error'; // 400 or 500
    this.isOperational = true;
  }
}

module.exports = RequestError;