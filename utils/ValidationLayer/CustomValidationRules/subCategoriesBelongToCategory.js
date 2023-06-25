const SubCategoryModel = require('../../../models/subCategoryModel');
const requestError = require("../../requestError");

module.exports = async (values, {req}) => {
    // get category from request body
    const { category } = req.body;
    // if there is subCategories ids in request body
    if (values.length > 0) {
        // loop over subCategory ids and check if they belong to the category
        let notBelong = new Set();
        // get all subCategories that belong to the category and ids in request body
        const subCategories = await SubCategoryModel.find({ _id: {$in: values}, category }).select('_id');
        // get all subCategories ids that belong to the category
        const subCategoriesIds = subCategories.map(subCategory => subCategory._id.toString());
        // loop over subCategory ids and check if they belong to the category
        for(const value of values){
            if(!subCategoriesIds.includes(value))
                notBelong.add(value);
        }
        // if there is subCategories that do not belong to the category then throw error
        if (notBelong.size > 0)
            throw new requestError(`subCategories: ${[...notBelong]} do not belong to category: ${category}`, 400);
    }
    return true;
}