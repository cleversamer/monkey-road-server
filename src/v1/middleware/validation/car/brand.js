const commonMiddleware = require("../common");

const getPopularBrandsValidator = [
  commonMiddleware.putQueryParamsInBody,
  commonMiddleware.checkSkip,
  commonMiddleware.next,
];

module.exports = {
  getPopularBrandsValidator,
};
