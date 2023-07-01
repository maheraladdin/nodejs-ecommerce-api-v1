const User = require('../../../models/UserModel');
const RequestError = require('../../../utils/RequestError');

module.exports = async (currentPassword,{req}) => {
    const {id} = req.params;
    const isCorrectCurrentPassword = await User.isCurrentPassword(currentPassword,id)
    if(!isCorrectCurrentPassword) throw new RequestError("Current password is incorrect", 400);
    return true;
};