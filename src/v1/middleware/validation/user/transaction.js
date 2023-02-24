const commonMiddleware = require("../common");

const getMyTransactionsValidator = [
  commonMiddleware.putQueryParamsInBody,
  commonMiddleware.checkPage,
  commonMiddleware.checkLimit,
  commonMiddleware.next,
];

const exportUserTransactionsToExcelValidator = [
  commonMiddleware.putQueryParamsInBody,
  commonMiddleware.checkUserId,
  commonMiddleware.next,
];

module.exports = {
  getMyTransactionsValidator,
  exportUserTransactionsToExcelValidator,
};
