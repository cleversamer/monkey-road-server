const { Order } = require("../../models/user/order.model");
const { ApiError } = require("../../middleware/apiError");
const httpStatus = require("http-status");
const errors = require("../../config/errors");

module.exports.getMyOrders = async (user, skip) => {
  try {
    const orders = await Order.find({ author: user._id })
      .sort({ _id: -1 })
      .skip(skip)
      .limit(10);

    if (!orders || !orders.length) {
      const statusCode = httpStatus.NOT_FOUND;
      const message = errors.order.notFound;
      throw new ApiError(statusCode, message);
    }

    return orders;
  } catch (err) {
    throw err;
  }
};
