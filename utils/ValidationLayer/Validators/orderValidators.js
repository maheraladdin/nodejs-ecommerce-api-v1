const expressValidatorCallback = require("../expressValidatorCallback");
const { OrderIdRule, shippingAddressRule, isPaidRule, isCancelledRule, isDeliveredlRule} = require("../ValidationRules/orderRules");

module.exports.getOrderByIdValidator = expressValidatorCallback([OrderIdRule]);

module.exports.createCashOrderValidator = expressValidatorCallback([OrderIdRule, shippingAddressRule]);

module.exports.updateOrderPaidStatusValidator = expressValidatorCallback([OrderIdRule, isPaidRule]);

module.exports.updateOrderDeliverStatusValidator = expressValidatorCallback([OrderIdRule, isDeliveredlRule]);

module.exports.updateOrderCancelStatusValidator = expressValidatorCallback([OrderIdRule, isCancelledRule]);

module.exports.getCheckoutSessionValidator = expressValidatorCallback([OrderIdRule, shippingAddressRule]);