const { validationResult } = require('express-validator');

// @desc: Use this middleware to handle validation errors from express-validator
// @note: this middleware should be placed after express-validator middleware
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