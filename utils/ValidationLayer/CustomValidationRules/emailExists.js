const User = require('../../../models/UserModel');
const RequestError = require("../../RequestError");

/**
 * @desc    Check if email is already in use
 * @param   {string} email - email to check if already in use
 * @return  {Promise<void>}
 */
module.exports = async (email) => {
    const isExist = await User.findOne({email});
    if(isExist) throw new RequestError(`email is already in use`, 400);
}