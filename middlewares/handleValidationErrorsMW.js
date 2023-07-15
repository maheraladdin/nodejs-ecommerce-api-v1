const { validationResult } = require('express-validator');

/**
 * @desc    Middleware to handle validation errors
 * @param   {object} req - request object
 * @param   {object} res - response object
 * @param   {function} next - next function
 * @return  {*}
 */
module.exports = (req,res,next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({
            status: "fail",
            errors: errors.array()
        });
    }
    next();
}