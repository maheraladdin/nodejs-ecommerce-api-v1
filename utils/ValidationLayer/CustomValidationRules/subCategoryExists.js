const SubCategoryModel = require('../../../models/subCategoryModel');
const requestError = require("../../requestError");

module.exports = async (values) => {
    if (values.length > 0) {
        // loop over subCategory ids and check if they exist
        let notExists = new Set();
        for (const value of values) {
            const subCategoryExists = await SubCategoryModel.exists({ _id: value });
            if (!subCategoryExists)
                notExists.add(value);
        }
        if (notExists.size > 0)
            throw new requestError(`there is no subcategory exists for id: [${[...notExists].join(", ")}]`, 404);
    }
    return true;
}