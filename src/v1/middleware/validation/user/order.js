const commonMiddleware = require("../common");

const getMyOrdersValidator = [
  commonMiddleware.putQueryParamsInBody,
  commonMiddleware.checkSkip,
  commonMiddleware.next,
];

const getOrderDetailsValidator = [
  commonMiddleware.putQueryParamsInBody,
  commonMiddleware.checkOrderId,
  commonMiddleware.next,
];

const cancelOrderValidator = [
  commonMiddleware.putQueryParamsInBody,
  commonMiddleware.checkOrderId,
  commonMiddleware.next,
];

const deleteOrderValidator = [
  commonMiddleware.putQueryParamsInBody,
  commonMiddleware.checkOrderId,
  commonMiddleware.next,
];

module.exports = {
  getMyOrdersValidator,
  getOrderDetailsValidator,
  cancelOrderValidator,
  deleteOrderValidator,
};
