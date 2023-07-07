const  {idRule} = require("./RulesFactory");
const Product = require("../../../models/productModel");
const RequestError = require("../../RequestError");

/**
 * @desc: Rule checks if product with provided id exists
 * @param {string} value - product id
 * @return {Promise<boolean>}
 */
const productExistsHandler = async (value) => {
    const isProductExists = await Product.exists({_id: value});
    if (!isProductExists) {
        throw new RequestError("Product with provided id does not exist",404);
    }
    return true;
}

module.exports.ProductIdRule = idRule("product", {field: "product"})
    .custom(productExistsHandler);