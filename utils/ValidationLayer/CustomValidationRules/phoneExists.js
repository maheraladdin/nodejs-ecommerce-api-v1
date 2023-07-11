const User = require("../../../models/userModel");
const requestError = require("../../requestError");

/**
 * @desc: Rule checks if User phone is in use
 * @param {string} phone - User phone number to check
 * @return {Promise<void>}
 */
module.exports = async (phone) => {
    const isExist = await User.exists({phone});
    if (isExist) throw new requestError("Phone already in use", 400);
}