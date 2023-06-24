// check if category already exists
const requestError = require('../utils/requestError');
const CategoryModel = require('../models/categoryModel');

// @desc    Check if category exists
// @body    category
// @usage   use this middleware in routes to check if category id exists in CategoryModel
module.exports = async (req, res, next) => {
    const { category } = req.body;
    if (category) {
        const categoryExists = await CategoryModel.exists({_id: category});
        if (!categoryExists)
            return next(new requestError(`there is no category exists for id: ${category}`, 404));
    }
    next();
}