const { RentOrder } = require("../../models/car/rentOrder.model");
const { ApiError } = require("../../middleware/apiError");
const httpStatus = require("http-status");
const errors = require("../../config/errors");
const mongoose = require("mongoose");

//////////////////// Outer Services ////////////////////
module.exports.createOrder = async (
  purpose,
  author,
  rentCarId,
  totalPrice,
  locationTitle,
  longitude,
  latitude
) => {
  try {
    // Create the order
    const order = new RentOrder({
      author: author._id,
      rentCar: rentCarId,
      totalPrice,
      location: {
        title: locationTitle,
        longitude,
        latitude,
      },
      purpose,
    });

    // Save order to the DB
    await order.save();

    return order;
  } catch (err) {
    throw err;
  }
};

//////////////////// Common Services ////////////////////
module.exports.getMyOrders = async (user, skip) => {
  try {
    const orders = await RentOrder.aggregate([
      { $match: { author: user._id } },
      { $sort: { _id: -1 } },
      { $skip: parseInt(skip) },
      { $limit: 10 },
      {
        $lookup: {
          from: "users",
          localField: "office",
          foreignField: "_id",
          as: "office",
        },
      },
      {
        $lookup: {
          from: "rentcars",
          localField: "rentCar",
          foreignField: "_id",
          as: "rentCar",
        },
      },
      {
        $project: {
          _id: 1,
          author: 1,
          office: 1,
          rentCar: 1,
          fullName: 1,
          phoneNumber: 1,
          receptionLocation: 1,
          totalPrice: 1,
          status: 1,
          startDate: 1,
          endDate: 1,
          office: { $arrayElemAt: ["$office", 0] },
          rentCar: { $arrayElemAt: ["$rentCar", 0] },
          office: {
            _id: 1,
            avatarURL: 1,
            name: 1,
            email: 1,
            phone: 1,
            role: 1,
          },
        },
      },
    ]);

    if (!orders || !orders.length) {
      const statusCode = httpStatus.NOT_FOUND;
      const message = errors.rentOrder.noOrders;
      throw new ApiError(statusCode, message);
    }

    return orders;
  } catch (err) {
    throw err;
  }
};

module.exports.getOrderDetails = async (user, orderId) => {
  try {
    const orders = await RentOrder.aggregate([
      { $match: { _id: mongoose.Types.ObjectId(orderId) } },
      {
        $lookup: {
          from: "users",
          localField: "office",
          foreignField: "_id",
          as: "office",
        },
      },
      {
        $lookup: {
          from: "rentcars",
          localField: "rentCar",
          foreignField: "_id",
          as: "rentCar",
        },
      },
      {
        $project: {
          _id: 1,
          author: 1,
          office: 1,
          rentCar: 1,
          fullName: 1,
          phoneNumber: 1,
          receptionLocation: 1,
          totalPrice: 1,
          status: 1,
          startDate: 1,
          endDate: 1,
          office: { $arrayElemAt: ["$office", 0] },
          rentCar: { $arrayElemAt: ["$rentCar", 0] },
          office: {
            _id: 1,
            avatarURL: 1,
            name: 1,
            email: 1,
            phone: 1,
            role: 1,
          },
        },
      },
    ]);

    if (!orders || !orders.length) {
      const statusCode = httpStatus.NOT_FOUND;
      const message = errors.rentOrder.notFound;
      throw new ApiError(statusCode, message);
    }

    const isOrderOwner = orders[0].author.toString() === user._id.toString();
    if (!isOrderOwner) {
      const statusCode = httpStatus.FORBIDDEN;
      const message = errors.rentOrder.notOwner;
      throw new ApiError(statusCode, message);
    }

    return orders[0];
  } catch (err) {
    throw err;
  }
};

module.exports.closeOrder = async (user, orderId) => {
  try {
    // Check if orders exists
    const order = await RentOrder.findById(orderId);
    if (!order) {
      const statusCode = httpStatus.NOT_FOUND;
      const message = errors.rentOrder.notFound;
      throw new ApiError(statusCode, message);
    }

    // Check if the user is the order owner
    const isOrderOwner = order.author.toString() === user._id.toString();
    if (!isOrderOwner) {
      const statusCode = httpStatus.NOT_FOUND;
      const message = errors.rentOrder.notOwner;
      throw new ApiError(statusCode, message);
    }

    // Check if order is already closed
    if (order.isClosed()) {
      const statusCode = httpStatus.NOT_FOUND;
      const message = errors.rentOrder.alreadyClosed;
      throw new ApiError(statusCode, message);
    }

    // Update order's status
    order.close();

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
    const order = await RentOrder.findById(orderId);
    if (!order) {
      const statusCode = httpStatus.NOT_FOUND;
      const message = errors.rentOrder.notFound;
      throw new ApiError(statusCode, message);
    }

    // Check if the user is the order owner
    const isOrderOwner = order.author.toString() === user._id.toString();
    if (!isOrderOwner) {
      const statusCode = httpStatus.NOT_FOUND;
      const message = errors.rentOrder.notOwner;
      throw new ApiError(statusCode, message);
    }

    // Delete order
    await order.delete();

    return order;
  } catch (err) {
    throw err;
  }
};

//////////////////// Office Services ////////////////////
module.exports.getMyReceivedOrders = async (office, skip) => {
  try {
    const orders = await RentOrder.aggregate([
      { $match: { office: office._id } },
      { $sort: { _id: -1 } },
      { $skip: parseInt(skip) },
      { $limit: 10 },
      {
        $lookup: {
          from: "users",
          localField: "author",
          foreignField: "_id",
          as: "author",
        },
      },
      {
        $lookup: {
          from: "rentcars",
          localField: "rentCar",
          foreignField: "_id",
          as: "rentCar",
        },
      },
      {
        $project: {
          _id: 1,
          author: 1,
          office: 1,
          rentCar: 1,
          fullName: 1,
          phoneNumber: 1,
          receptionLocation: 1,
          totalPrice: 1,
          status: 1,
          startDate: 1,
          endDate: 1,
          author: { $arrayElemAt: ["$author", 0] },
          rentCar: { $arrayElemAt: ["$rentCar", 0] },
          author: {
            _id: 1,
            avatarURL: 1,
            name: 1,
            email: 1,
            phone: 1,
            role: 1,
          },
        },
      },
    ]);

    // Check if orders exists
    if (!orders || !orders.length) {
      const statusCode = httpStatus.NOT_FOUND;
      const message = errors.rentOrder.noReceivedOrders;
      throw new ApiError(statusCode, message);
    }

    return orders;
  } catch (err) {
    throw err;
  }
};

module.exports.approveOrder = async (office, orderId) => {
  try {
    // Check if orders exists
    const order = await RentOrder.findById(orderId);
    if (!order) {
      const statusCode = httpStatus.NOT_FOUND;
      const message = errors.rentOrder.notFound;
      throw new ApiError(statusCode, message);
    }

    // Check if the user is the receiver office
    const isOfficeReceiver = order.office.toString() === office._id.toString();
    if (!isOfficeReceiver) {
      const statusCode = httpStatus.NOT_FOUND;
      const message = errors.rentOrder.notReceiverOffice;
      throw new ApiError(statusCode, message);
    }

    // Check if order is already approved
    if (order.isApproved()) {
      const statusCode = httpStatus.NOT_FOUND;
      const message = errors.rentOrder.alreadyApproved;
      throw new ApiError(statusCode, message);
    }

    // Approve order
    order.approve();

    // Save order to the DB
    await order.save();

    return order;
  } catch (err) {
    throw err;
  }
};

module.exports.rejectOrder = async (office, orderId) => {
  try {
    // Check if orders exists
    const order = await RentOrder.findById(orderId);
    if (!order) {
      const statusCode = httpStatus.NOT_FOUND;
      const message = errors.rentOrder.notFound;
      throw new ApiError(statusCode, message);
    }

    // Check if the user is the receiver office
    const isOfficeReceiver = order.office.toString() === office._id.toString();
    if (!isOfficeReceiver) {
      const statusCode = httpStatus.NOT_FOUND;
      const message = errors.rentOrder.notReceiverOffice;
      throw new ApiError(statusCode, message);
    }

    // Check if order is already approved
    if (order.isRejected()) {
      const statusCode = httpStatus.NOT_FOUND;
      const message = errors.rentOrder.alreadyRejected;
      throw new ApiError(statusCode, message);
    }

    // Approve order
    order.reject();

    // Save order to the DB
    await order.save();

    return order;
  } catch (err) {
    throw err;
  }
};
