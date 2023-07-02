// require custom modules
const RequestError = require("../../RequestError");
const User = require("../../../models/UserModel");
// This rule is used to prevent users from changing their own role or other users role if they have less privileges
// permissionsHierarchy
module.exports = async (value, { req }) => {
    // get user permissions
    const { role } = req.user;

    // get user id from request params
    const { id } = req.params;

    // if user wants to change his own role, throw error
    if(id === req.user.id) throw new RequestError("You are not allowed to change your own role", 403);

    // get user role from db
    const userRole = await User.findById(id).select("role -_id");

    // if user and target user have the same role, throw error
    if(role === userRole.role) throw new RequestError("Dear User, You are not allowed to change user with same privileges as you are", 403);

    // if user is manager, he can change any user role except admin
    if(role === "manager" && req.body.role === "admin") throw new RequestError("Dear Manager, you are not allowed to change this user role", 403);

    return true;
}