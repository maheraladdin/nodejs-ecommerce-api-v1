const Brand = require("../../../models/brandModel");
const RequestError = require("../../requestError");

/**
 * @desc Check if brand exists
 * @param {string} value - brand id
 * @type {function(*=): Promise<boolean>}
 * @return {Promise<boolean>}
 */
module.exports = async (value) => {
    const brandExists = await Brand.exists({ _id: value });
    if (!brandExists)
        throw new RequestError(`there is no brand exists for id: ${value}`, 404);
    return true;
}