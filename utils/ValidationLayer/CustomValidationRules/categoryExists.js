const CategoryModel = require("../../../models/categoryModel");
const RequestError = require("../../RequestError");

module.exports = async (value) => {
    const categoryExists = await CategoryModel.exists({ _id: value });
    if (!categoryExists)
        throw new RequestError(`there is no category exists for id: ${value}`, 404);
    return true;
}