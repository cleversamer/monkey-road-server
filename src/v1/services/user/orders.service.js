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

module.exports.getOrder = async (user, orderId) => {
  try {
    const orders = await Order.aggregate([
      { $match: { "author.ref": user._id, _id: orderId } },
      {
        $lookup: {
          from: "User",
          localField: "seller",
          foreignField: "_id",
          as: "seller",
        },
      },
      {
        $lookup: {
          from: "RentCar",
          localField: "rentCar",
          foreignField: "_id",
          as: "rentCar",
        },
      },
      {
        $project: {
          _id: 1,
          author: 1,
          seller: 1,
          shippingAddress: 1,
          totalPrice: 1,
          rentCar: 1,
          purpose: 1,
          status: 1,
          date: 1,
          seller: { $arrayElemAt: ["$seller", 0] },
        },
      },
    ]);

    return orders[0];
  } catch (err) {
    throw err;
  }
};
