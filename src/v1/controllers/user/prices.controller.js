const { pricesService } = require("../../services");
const httpStatus = require("http-status");
const { CLIENT_SCHEMA } = require("../../models/user/price.model");
const _ = require("lodash");

//////////////////// Common Controllers ////////////////////
module.exports.getCouponPrices = async (req, res, next) => {
  try {
    const { priceFor, coupon } = req.query;

    const prices = await pricesService.getCouponPrices(priceFor, coupon);

    const response = {
      prices: prices.map((price) => _.pick(price, CLIENT_SCHEMA)),
    };

    res.status(httpStatus.OK).json(response);
  } catch (err) {
    next(err);
  }
};

//////////////////// Admin Controllers ////////////////////
module.exports.addPrice = async (req, res, next) => {
  try {
    const { priceFor, coupon, value, validityHours } = req.body;

    const price = await pricesService.addPrice(
      priceFor,
      coupon,
      value,
      validityHours
    );

    const response = _.pick(price, CLIENT_SCHEMA);

    res.status(httpStatus.CREATED).json(response);
  } catch (err) {
    next(err);
  }
};
