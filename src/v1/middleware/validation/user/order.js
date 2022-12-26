const errors = require("../../../config/errors");
const commonMiddleware = require("../common");

const getMyOrdersValidator = [
  commonMiddleware.putQueryParamsInBody,
  commonMiddleware.checkSkip,
  commonMiddleware.next,
];

module.exports = {
  getMyOrdersValidator,
};
