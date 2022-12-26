const commonMiddleware = require("../common");

const getAllRentCarsValidator = [
  commonMiddleware.putQueryParamsInBody,
  commonMiddleware.checkSkip,
  commonMiddleware.next,
];

const getRentCarDetailsValidator = [
  commonMiddleware.checkMongoIdParam,
  commonMiddleware.next,
];

const getSimilarRentCarsValidator = [
  commonMiddleware.putQueryParamsInBody,
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
  commonMiddleware.checkSkip,
  commonMiddleware.checkSearchTerm,
  commonMiddleware.next,
];

const getMyRentCarsValidator = [
  commonMiddleware.putQueryParamsInBody,
  commonMiddleware.checkSkip,
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
  commonMiddleware.next,
];

module.exports = {
  getAllRentCarsValidator,
  getRentCarDetailsValidator,
  getSimilarRentCarsValidator,
  searchRentCarsValidator,
  getMyRentCarsValidator,
  addRentCarValidator,
};
