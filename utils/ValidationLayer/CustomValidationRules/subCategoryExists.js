const SubCategory = require('../../../models/subCategoryModel');
const RequestError = require("../../requestError");

/**
 * @desc Check if subCategories exists
 * @param {string[]} values - subCategories ids
 * @type {function(*=): Promise<boolean>}
 * @return {Promise<boolean>}
 */
module.exports = async (values) => {
    if (values.length > 0) {
        // loop over subCategory ids and check if they exist
        let notExists = new Set();
        // get all subCategories that exist
        const subCategories = await SubCategory.find({ _id: { $in: values } }).select('_id');
        // get all subCategories ids that exist
        const subCategoriesIds = subCategories.map(subCategory => subCategory._id.toString());
        // loop over subCategory ids and check if they exist
        for(const value of values){
            if(!subCategoriesIds.includes(value))
                notExists.add(value);
        }
        // if there is subCategories that do not exist then throw error
        if (notExists.size > 0) {
            throw new RequestError(`there is no subCategory exists for ids: ${[...notExists]}`, 404);
        }
    }
    return true;
}