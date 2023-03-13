const { Price } = require("../../models/user/price.model");
const { ApiError } = require("../../middleware/apiError");
const httpStatus = require("http-status");
const errors = require("../../config/errors");

//////////////////// Common Services ////////////////////
module.exports.getCouponPrices = async (priceFor, coupon) => {
  try {
    // Check if prices exist
    const prices = await Price.find({ priceFor, coupon, active: true });
    if (!prices || !prices.length) {
      const statusCode = httpStatus.NOT_FOUND;
      const message = errors.price.noCouponPrices;
      throw new ApiError(statusCode, message);
    }

    return prices;
  } catch (err) {
    throw err;
  }
};

//////////////////// Admin Services ////////////////////
module.exports.addPrice = async (priceFor, coupon, value, validityHours) => {
  try {
    const price = new Price({ priceFor, coupon, value });

    // Set expiry date if exists
    price.setExpiryDate(validityHours);

    // Save price to the DB
    await price.save();

    return price;
  } catch (err) {
    throw err;
  }
};
