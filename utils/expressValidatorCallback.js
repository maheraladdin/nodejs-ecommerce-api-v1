const handleValidationErrorsMW = require("../middlewares/handleValidationErrorsMW");

// @desc: express validator refactoring just send rules
// @usage: expressValidatorCallback([Rule_1_Name,Rule_2_Name])
// @note: you have to send rules inside array, and you can send any number of rules inside that array
module.exports = (rules) => [
    ...rules,
    handleValidationErrorsMW
];