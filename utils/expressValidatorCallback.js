const handleValidationErrorsMW = require("../middlewares/handleValidationErrorsMW");

// @desc: express validator refactoring just send rules and middlewares and get the job done
// @usage: expressValidatorCallback([Rule_1_Name,Rule_2_Name],[middleware_1,middleware_2])
// @note: you have to send rules and middlewares inside array, and you can send any number of them
module.exports = (rules) => [
    ...rules,
    handleValidationErrorsMW
];