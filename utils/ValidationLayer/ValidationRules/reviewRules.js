const {idRule} = require("./RulesFactory");
const {check} = require("express-validator");
const ReviewUserIdCustomRule = require("../CustomValidationRules/ReviewUserIdCustomRule");
const ReviewIdRuleForDeleteCustomRule = require("../CustomValidationRules/ReviewIdRuleForDeleteCustomRule");
// @desc: Rule checks if review id is valid mongo id
module.exports.ReviewIdRule = idRule("Review");

// @desc: Rule checks if rating is provided, and is between 1 and 5
module.exports.ReviewRatingRule = check("ratings")
    .notEmpty()
    .withMessage("Rating is required")
    .isFloat({min: 1, max: 5})
    .withMessage("Rating must be between 1 and 5");

// @desc: Rule checks if user id is valid mongo id
module.exports.ReviewUserIdRule = idRule("User", {field: "user"})
    .custom(ReviewUserIdCustomRule)

// @desc: Rule checks if product id is valid mongo id
module.exports.ReviewProductIdRule = idRule("Product", {field: "product"});

// @desc: Rule checks if review id is valid mongo id in case of the user role is admin or manager then he can delete any review otherwise he can delete only his own reviews
module.exports.ReviewIdRuleForDelete = idRule("Review")
    .custom(ReviewIdRuleForDeleteCustomRule);