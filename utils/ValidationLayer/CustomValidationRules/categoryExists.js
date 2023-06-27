const Category = require("../../../models/categoryModel");
const RequestError = require("../../RequestError");

/**
 * @desc Check if category exists
 * @param {string} value - category id
 * @type {function(*=): Promise<boolean>}
 * @return {Promise<boolean>}
 */
module.exports = async (value) => {
    const categoryExists = await Category.exists({ _id: value });
    if (!categoryExists)
        throw new RequestError(`there is no category exists for id: ${value}`, 404);
    return true;
}