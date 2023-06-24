const CategoryModel = require("../../../models/categoryModel");
const requestError = require("../../requestError");

module.exports = async (value) => {
    const categoryExists = await CategoryModel.exists({ _id: value });
    if (!categoryExists)
        throw new requestError(`there is no category exists for id: ${value}`, 404);
    return true;
}