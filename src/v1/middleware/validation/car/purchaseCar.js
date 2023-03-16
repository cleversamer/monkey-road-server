const commonMiddleware = require("../common");

const getPurchaseCarDetailsValidator = [
  commonMiddleware.putQueryParamsInBody,
  commonMiddleware.checkCarId,
  commonMiddleware.next,
];

const getRecentlyArrivedPurchaseCarsValidator = [
  commonMiddleware.putQueryParamsInBody,
  commonMiddleware.checkPage,
  commonMiddleware.checkLimit,
  commonMiddleware.next,
];

const getLatestModelsPurchaseCarsValidator = [
  commonMiddleware.putQueryParamsInBody,
  commonMiddleware.checkPage,
  commonMiddleware.checkLimit,
  commonMiddleware.next,
];

const getBestSellerPurchaseCarsValidator = [
  commonMiddleware.putQueryParamsInBody,
  commonMiddleware.checkPage,
  commonMiddleware.checkLimit,
  commonMiddleware.next,
];

const searchPurchaseCarsValidator = [
  commonMiddleware.putQueryParamsInBody,
  commonMiddleware.checkPage,
  commonMiddleware.checkLimit,
  commonMiddleware.checkSearchTerm,
  commonMiddleware.conditionalCheck(
    "minPrice",
    commonMiddleware.checkRentCarSearchMinPrice
  ),
  commonMiddleware.conditionalCheck(
    "maxPrice",
    commonMiddleware.checkRentCarSearchMaxPrice
  ),
  commonMiddleware.checkSearchBrandsList,
  commonMiddleware.checkSearchColors,
  commonMiddleware.checkSearchYears,
  commonMiddleware.next,
];

const getMyPurchaseCarsValidator = [
  commonMiddleware.putQueryParamsInBody,
  commonMiddleware.checkPage,
  commonMiddleware.checkLimit,
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
  commonMiddleware.checkPhoneICC,
  commonMiddleware.checkPhoneNSN,
  commonMiddleware.checkPurchaseCarDescription,
  commonMiddleware.checkFile("photo1", ["png", "jpg", "jpeg"], true),
  commonMiddleware.checkFile("photo2", ["png", "jpg", "jpeg"], false),
  commonMiddleware.checkFile("photo3", ["png", "jpg", "jpeg"], false),
  commonMiddleware.checkFile("photo4", ["png", "jpg", "jpeg"], false),
  commonMiddleware.checkFile("photo5", ["png", "jpg", "jpeg"], false),
  commonMiddleware.checkFile("photo6", ["png", "jpg", "jpeg"], false),
  commonMiddleware.next,
];

const payPurchaseCarPostCostValidator = [
  commonMiddleware.putQueryParamsInBody,
  commonMiddleware.checkCarId,
  commonMiddleware.next,
];

const markPurchaseCarAsSoldValidator = [
  commonMiddleware.putQueryParamsInBody,
  commonMiddleware.checkCarId,
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
  payPurchaseCarPostCostValidator,
  markPurchaseCarAsSoldValidator,
};
