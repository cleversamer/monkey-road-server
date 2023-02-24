const commonMiddleware = require("../common");

const getAllRentCarsValidator = [
  commonMiddleware.putQueryParamsInBody,
  commonMiddleware.checkPage,
  commonMiddleware.checkLimit,
  commonMiddleware.next,
];

const getRentCarDetailsValidator = [
  commonMiddleware.putQueryParamsInBody,
  commonMiddleware.checkCarId,
  commonMiddleware.next,
];

const getSimilarRentCarsValidator = [
  commonMiddleware.putQueryParamsInBody,
  commonMiddleware.checkCarId,
  commonMiddleware.checkRentCarName,
  commonMiddleware.checkRentCarModel,
  commonMiddleware.checkRentCarENBrand,
  commonMiddleware.checkRentCarARBrand,
  commonMiddleware.checkRentCarENColor,
  commonMiddleware.checkRentCarARColor,
  commonMiddleware.checkRentCarYear,
  commonMiddleware.checkRentCarDescription,
  commonMiddleware.next,
];

const searchRentCarsValidator = [
  commonMiddleware.putQueryParamsInBody,
  commonMiddleware.checkSearchTerm,
  commonMiddleware.checkPage,
  commonMiddleware.checkLimit,
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

const requestCarRentalValidator = [
  commonMiddleware.putQueryParamsInBody,
  commonMiddleware.checkCarId,
  commonMiddleware.checkNoOfDays,
  commonMiddleware.checkStartDate,
  commonMiddleware.checkLocationTitle,
  commonMiddleware.checkPhoneICC,
  commonMiddleware.checkPhoneNSN,
  commonMiddleware.checkFullName,
  commonMiddleware.checkLongitude,
  commonMiddleware.checkLatitude,
  commonMiddleware.next,
];

const getMyRentCarsValidator = [
  commonMiddleware.putQueryParamsInBody,
  commonMiddleware.checkPage,
  commonMiddleware.checkLimit,
  commonMiddleware.next,
];

const addRentCarValidator = [
  commonMiddleware.checkRentCarName,
  commonMiddleware.checkRentCarModel,
  commonMiddleware.checkRentCarENColor,
  commonMiddleware.checkRentCarARColor,
  commonMiddleware.checkBrand,
  commonMiddleware.checkRentCarYear,
  commonMiddleware.checkRentCarDailyPrice,
  commonMiddleware.checkRentCarWeeklyPrice,
  commonMiddleware.checkRentCarMonthlyPrice,
  commonMiddleware.checkRentCarDeposit,
  commonMiddleware.checkRentCarDescription,
  commonMiddleware.checkFile("photo1", ["png", "jpg", "jpeg"], true),
  commonMiddleware.checkFile("photo2", ["png", "jpg", "jpeg"], false),
  commonMiddleware.checkFile("photo3", ["png", "jpg", "jpeg"], false),
  commonMiddleware.checkFile("photo4", ["png", "jpg", "jpeg"], false),
  commonMiddleware.checkFile("photo5", ["png", "jpg", "jpeg"], false),
  commonMiddleware.checkFile("photo6", ["png", "jpg", "jpeg"], false),
  commonMiddleware.next,
];

const archiveRentCarValidator = [
  commonMiddleware.putQueryParamsInBody,
  commonMiddleware.checkCarId,
  commonMiddleware.next,
];

const restoreRentCarValidator = [
  commonMiddleware.putQueryParamsInBody,
  commonMiddleware.checkCarId,
  commonMiddleware.next,
];

const deleteRentCarValidator = [
  commonMiddleware.putQueryParamsInBody,
  commonMiddleware.checkCarId,
  commonMiddleware.next,
];

const getNotAcceptedRentCarsValidator = [
  commonMiddleware.putQueryParamsInBody,
  commonMiddleware.checkSkip,
  commonMiddleware.next,
];

const acceptRentCarValidator = [
  commonMiddleware.putQueryParamsInBody,
  commonMiddleware.checkCarId,
  commonMiddleware.next,
];

const rejectRentCarValidator = [
  commonMiddleware.putQueryParamsInBody,
  commonMiddleware.checkCarId,
  commonMiddleware.checkRejectionReason,
  commonMiddleware.next,
];

module.exports = {
  getAllRentCarsValidator,
  getRentCarDetailsValidator,
  getSimilarRentCarsValidator,
  searchRentCarsValidator,
  requestCarRentalValidator,
  getMyRentCarsValidator,
  addRentCarValidator,
  archiveRentCarValidator,
  restoreRentCarValidator,
  deleteRentCarValidator,
  getNotAcceptedRentCarsValidator,
  acceptRentCarValidator,
  rejectRentCarValidator,
};
