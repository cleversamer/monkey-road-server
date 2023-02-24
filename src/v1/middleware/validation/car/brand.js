const commonMiddleware = require("../common");

const getPopularBrandsValidator = [
  commonMiddleware.putQueryParamsInBody,
  commonMiddleware.checkPage,
  commonMiddleware.checkLimit,
  commonMiddleware.next,
];

const addBrandValidator = [
  commonMiddleware.checkBrandENName,
  commonMiddleware.checkBrandARName,
  commonMiddleware.checkFile("photo", ["png", "jpg", "jpeg"], true),
  commonMiddleware.next,
];

module.exports = {
  getPopularBrandsValidator,
  addBrandValidator,
};
