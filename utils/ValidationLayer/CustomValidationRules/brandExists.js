const BrandModel = require("../../../models/brandModel");
const requestError = require("../../requestError");

module.exports = async (value) => {
    const brandExists = await BrandModel.exists({ _id: value });
    if (!brandExists)
        throw new requestError(`there is no brand exists for id: ${value}`, 404);
    return true;
}