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

module.exports = {
  getMyOrdersValidator,
  getOrderDetailsValidator,
};
