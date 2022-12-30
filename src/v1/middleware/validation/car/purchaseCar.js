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
  commonMiddleware.checkPurchaseCarENFuelType,
  commonMiddleware.checkPurchaseCarARFuelType,
  commonMiddleware.checkPurchaseCarNoOfSeats,
  commonMiddleware.checkPurchaseCarKiloPerHour,
  commonMiddleware.checkPurchaseCarPrice,
  commonMiddleware.checkPurchaseCarPhoneNumber,
  commonMiddleware.checkPurchaseCarDescription,
  commonMiddleware.checkFile("photo1", ["png", "jpg", "jpeg"], true),
  commonMiddleware.checkFile("photo2", ["png", "jpg", "jpeg"], false),
  commonMiddleware.checkFile("photo3", ["png", "jpg", "jpeg"], false),
  commonMiddleware.checkFile("photo4", ["png", "jpg", "jpeg"], false),
  commonMiddleware.checkFile("photo5", ["png", "jpg", "jpeg"], false),
  commonMiddleware.checkFile("photo6", ["png", "jpg", "jpeg"], false),
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
