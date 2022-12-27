const commonMiddleware = require("../common");

const getPopularBrandsValidator = [
  commonMiddleware.putQueryParamsInBody,
  commonMiddleware.checkSkip,
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
