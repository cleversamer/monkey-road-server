const commonMiddleware = require("../common");

const getPurchaseCarDetailsValidator = [
  commonMiddleware.checkMongoIdParam,
  commonMiddleware.next,
];

const getRecentlyArrivedPurchaseCarsValidator = [
  commonMiddleware.putQueryParamsInBody,
  commonMiddleware.checkSkip,
  commonMiddleware.next,
];

const getLatestModelsPurchaseCarsValidator = [
  commonMiddleware.putQueryParamsInBody,
  commonMiddleware.checkSkip,
  commonMiddleware.next,
];

const getBestSellerPurchaseCarsValidator = [
  commonMiddleware.putQueryParamsInBody,
  commonMiddleware.checkSkip,
  commonMiddleware.next,
];

const searchPurchaseCarsValidator = [
  commonMiddleware.putQueryParamsInBody,
  commonMiddleware.checkSkip,
  commonMiddleware.checkSearchTerm,
  commonMiddleware.next,
];

const getMyPurchaseCarsValidator = [
  commonMiddleware.putQueryParamsInBody,
  commonMiddleware.checkSkip,
  commonMiddleware.next,
];

module.exports = {
  getPurchaseCarDetailsValidator,
  getRecentlyArrivedPurchaseCarsValidator,
  getLatestModelsPurchaseCarsValidator,
  getBestSellerPurchaseCarsValidator,
  searchPurchaseCarsValidator,
  getMyPurchaseCarsValidator,
};
