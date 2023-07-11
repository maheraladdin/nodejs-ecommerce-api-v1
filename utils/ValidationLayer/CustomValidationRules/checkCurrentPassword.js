const User = require('../../../models/userModel');
const RequestError = require('../../requestError');
const bcrypt = require("bcrypt");

/**
 * @desc    Check if current password is correct and new password is different from current password
 * @param {string} currentPassword - Current password
 * @param {object} req - Request object
 * @param {object} req.params - Request params object
 * @param {string} req.params.id - User id
 * @param {object} req.user - Logged user object
 * @param {string} req.user.id - Logged user id
 * @param {object} req.body - Request body object
 * @param {string} req.body.password - New password
 * @return {Promise<boolean>}
 */
module.exports = async (currentPassword,{req}) => {
    const id = req.params.id || req.user.id;
    // get user password from db
    const userPasswordInDb = await User.findById(id).select("+password");
    // check if current password is correct
    const isCorrectCurrentPassword = bcrypt.compareSync(currentPassword, userPasswordInDb.password);
    if(!isCorrectCurrentPassword) throw new RequestError("Current password is incorrect", 400);
    // check if new password is different from current password
    const isSamePassword = bcrypt.compareSync(req.body.password, userPasswordInDb.password);
    if(isSamePassword) throw new RequestError("New password must be different from current password", 400);
    return true;
};