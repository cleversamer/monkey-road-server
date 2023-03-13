const commonMiddleware = require("../common");

module.exports.getCouponPricesValidator = [
  commonMiddleware.putQueryParamsInBody,
  commonMiddleware.checkPriceFor,
  commonMiddleware.checkPriceCoupon,
  commonMiddleware.next,
];

module.exports.addPriceValidator = [
  commonMiddleware.checkPriceFor,
  commonMiddleware.checkPriceCoupon,
  commonMiddleware.checkPriceValue,
  commonMiddleware.conditionalCheck(
    "validityHours",
    commonMiddleware.checkPriceValidityHours
  ),
  commonMiddleware.next,
];
