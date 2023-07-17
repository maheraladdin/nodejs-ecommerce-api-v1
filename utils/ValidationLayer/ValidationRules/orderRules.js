const {idRule} = require("./RulesFactory");
const {check} = require("express-validator");

module.exports.OrderIdRule = idRule("Order");

module.exports.shippingAddressRule = check("shippingAddress")
    .trim()
    .notEmpty()
    .withMessage("Shipping address is required");

module.exports.isPaidRule = check("isPaid")
    .optional()
    .isBoolean()
    .withMessage("isPaid must be boolean");

module.exports.isDeliveredlRule = check("isDelivered")
    .optional()
    .isBoolean()
    .withMessage("isPaid must be boolean");

module.exports.isCancelledRule = check("isCancelled")
    .optional()
    .isBoolean()
    .withMessage("isPaid must be boolean");

