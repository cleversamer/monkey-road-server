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

const addPurchaseCarValidator = [
  commonMiddleware.checkPurchaseCarName,
  commonMiddleware.checkPurchaseCarVIN,
  commonMiddleware.checkPurchaseCarModel,
  commonMiddleware.checkBrand,
  commonMiddleware.checkPurchaseCarYear,
  commonMiddleware.checkPurchaseCarENColor,
  commonMiddleware.checkPurchaseCarARColor,
  commonMiddleware.checkPurchaseCarTrimeLevel,
  commonMiddleware.checkPurchaseCarENVehicleType,
  commonMiddleware.checkPurchaseCarARVehicleType,
  commonMiddleware.checkPurchaseCarNoOfSeats,
  commonMiddleware.checkPurchaseCarKiloPerHour,
  commonMiddleware.checkPurchaseCarPrice,
  commonMiddleware.checkPurchaseCarPhoneNumber,
  commonMiddleware.checkPurchaseCarDescription,
  commonMiddleware.next,
];

module.exports = {
  getPurchaseCarDetailsValidator,
  getRecentlyArrivedPurchaseCarsValidator,
  getLatestModelsPurchaseCarsValidator,
  getBestSellerPurchaseCarsValidator,
  searchPurchaseCarsValidator,
  getMyPurchaseCarsValidator,
  addPurchaseCarValidator,
};
