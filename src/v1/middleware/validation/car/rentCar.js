const commonMiddleware = require("../common");

const getAllRentCarsValidator = [
  (req, res, next) => {
    req.body = {
      ...req.body,
      ...req.query,
    };

    next();
  },
  commonMiddleware.checkSkip,
  commonMiddleware.next,
];

const getRentCarDetailsValidator = [
  commonMiddleware.checkMongoIdParam,
  commonMiddleware.next,
];

const getSimilarRentCarsValidator = [
  (req, res, next) => {
    req.body = {
      ...req.body,
      ...req.query,
    };

    next();
  },
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
  (req, res, next) => {
    req.body = {
      ...req.body,
      ...req.query,
    };

    next();
  },
  commonMiddleware.checkSkip,
  commonMiddleware.checkSearchTerm,
  commonMiddleware.next,
];

const getMyRentCarsValidator = [
  (req, res, next) => {
    req.body = {
      ...req.body,
      ...req.query,
    };

    next();
  },
  commonMiddleware.checkSkip,
  commonMiddleware.next,
];

module.exports = {
  getAllRentCarsValidator,
  getRentCarDetailsValidator,
  getSimilarRentCarsValidator,
  searchRentCarsValidator,
  getMyRentCarsValidator,
};
