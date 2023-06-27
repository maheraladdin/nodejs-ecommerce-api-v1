const BrandModel = require("../../../models/brandModel");
const RequestError = require("../../RequestError");

module.exports = async (value) => {
    const brandExists = await BrandModel.exists({ _id: value });
    if (!brandExists)
        throw new RequestError(`there is no brand exists for id: ${value}`, 404);
    return true;
}