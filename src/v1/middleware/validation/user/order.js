const commonMiddleware = require("../common");

const getMyOrdersValidator = [
  commonMiddleware.putQueryParamsInBody,
  commonMiddleware.checkSkip,
  commonMiddleware.next,
];

const getOrderDetailsValidator = [
  commonMiddleware.checkMongoIdParam,
  commonMiddleware.next,
];

const cancelOrderValidator = [
  commonMiddleware.checkMongoIdParam,
  commonMiddleware.next,
];

const deleteOrderValidator = [
  commonMiddleware.checkMongoIdParam,
  commonMiddleware.next,
];

module.exports = {
  getMyOrdersValidator,
  getOrderDetailsValidator,
  cancelOrderValidator,
  deleteOrderValidator,
};
