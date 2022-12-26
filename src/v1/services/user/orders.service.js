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
      const message = errors.order.noOrders;
      throw new ApiError(statusCode, message);
    }

    return orders;
  } catch (err) {
    throw err;
  }
};

module.exports.getOrderDetails = async (user, orderId) => {
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

module.exports.cancelOrder = async (user, orderId) => {
  try {
    // Check if orders exists
    const order = await Order.findById(orderId);
    if (!order) {
      const statusCode = httpStatus.NOT_FOUND;
      const message = errors.order.notFound;
      throw new ApiError(statusCode, message);
    }

    // Check if the user is the order owner
    const isOrderOwner = order.author.ref.toString() === user._id.toString();
    if (!isOrderOwner) {
      const statusCode = httpStatus.NOT_FOUND;
      const message = errors.order.notOwner;
      throw new ApiError(statusCode, message);
    }

    // Update order's status
    order.cancel();

    // Save the order
    await order.save();

    return order;
  } catch (err) {
    throw err;
  }
};

module.exports.deleteOrder = async (user, orderId) => {
  try {
    // Check if orders exists
    const order = await Order.findById(orderId);
    if (!order) {
      const statusCode = httpStatus.NOT_FOUND;
      const message = errors.order.notFound;
      throw new ApiError(statusCode, message);
    }

    // Check if the user is the order owner
    const isOrderOwner = order.author.ref.toString() === user._id.toString();
    if (!isOrderOwner) {
      const statusCode = httpStatus.NOT_FOUND;
      const message = errors.order.notOwner;
      throw new ApiError(statusCode, message);
    }

    // Delete the order
    await order.delete();

    return order;
  } catch (err) {
    throw err;
  }
};
