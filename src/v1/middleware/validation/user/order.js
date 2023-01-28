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

const closeOrderValidator = [
  commonMiddleware.putQueryParamsInBody,
  commonMiddleware.checkOrderId,
  commonMiddleware.next,
];

const deleteOrderValidator = [
  commonMiddleware.putQueryParamsInBody,
  commonMiddleware.checkOrderId,
  commonMiddleware.next,
];

const getMyReceivedOrdersValidator = [
  commonMiddleware.putQueryParamsInBody,
  commonMiddleware.checkSkip,
  commonMiddleware.next,
];

const approveOrderValidator = [
  commonMiddleware.putQueryParamsInBody,
  commonMiddleware.checkOrderId,
  commonMiddleware.next,
];

const rejectOrderValidator = [
  commonMiddleware.putQueryParamsInBody,
  commonMiddleware.checkOrderId,
  commonMiddleware.next,
];

module.exports = {
  getMyOrdersValidator,
  getOrderDetailsValidator,
  closeOrderValidator,
  deleteOrderValidator,
  getMyReceivedOrdersValidator,
  approveOrderValidator,
  rejectOrderValidator,
};
