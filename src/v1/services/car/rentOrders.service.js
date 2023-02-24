const { RentOrder } = require("../../models/car/rentOrder.model");
const { RentCar } = require("../../models/car/rentCar.model");
const { ApiError } = require("../../middleware/apiError");
const httpStatus = require("http-status");
const errors = require("../../config/errors");
const mongoose = require("mongoose");
const transactionsService = require("../user/transactions.service");
const usersService = require("../user/users.service");

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

module.exports.getRentOrdersStatus = async () => {
  try {
    const rentOrders = await RentOrder.find({});

    const totalCount = rentOrders.length;

    return {
      total: totalCount,
    };
  } catch (err) {
    throw err;
  }
};

//////////////////// Common Services ////////////////////
module.exports.getMyOrders = async (user, page, limit) => {
  try {
    page = parseInt(page);
    limit = parseInt(limit);

    const orders = await RentOrder.aggregate([
      { $match: { author: user._id } },
      { $sort: { _id: -1 } },
      { $skip: (page - 1) * limit },
      { $limit: limit },
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

    const results = await RentOrder.aggregate([
      { $match: { author: user._id } },
    ]);
    const count = results.length;

    return {
      orders,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
    };
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

    // Check if rent car exists
    const rentCar = await RentCar.findById(order.rentCar);
    if (!rentCar) {
      const statusCode = httpStatus.NOT_FOUND;
      const message = errors.rentCar.notFound;
      throw new ApiError(statusCode, message);
    }

    // Check if the user is the order owner
    const isOrderOwner = order.author.toString() === user._id.toString();
    if (!isOrderOwner) {
      const statusCode = httpStatus.FORBIDDEN;
      const message = errors.rentOrder.notOwner;
      throw new ApiError(statusCode, message);
    }

    // Check if order is already closed
    if (order.isClosed()) {
      const statusCode = httpStatus.BAD_REQUEST;
      const message = errors.rentOrder.alreadyClosed;
      throw new ApiError(statusCode, message);
    }

    // Check if order is paid and waiting for delivery
    if (order.isWaitingForDelivery()) {
      const statusCode = httpStatus.BAD_REQUEST;
      const message = errors.rentOrder.closePaidOrder;
      throw new ApiError(statusCode, message);
    }

    // Mark order as closed
    order.close();

    // Save order to the DB
    await order.save();

    return { order, rentCar };
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

    // Check if rent car exists
    const rentCar = await RentCar.findById(order.rentCar);
    if (!rentCar) {
      const statusCode = httpStatus.NOT_FOUND;
      const message = errors.rentCar.notFound;
      throw new ApiError(statusCode, message);
    }

    // Check if the user is the order owner
    const isOrderOwner = order.author.toString() === user._id.toString();
    if (!isOrderOwner) {
      const statusCode = httpStatus.FORBIDDEN;
      const message = errors.rentOrder.notOwner;
      throw new ApiError(statusCode, message);
    }

    // Check if order is paid and waiting for delivery
    if (order.isWaitingForDelivery()) {
      const statusCode = httpStatus.BAD_REQUEST;
      const message = errors.rentOrder.deletePaidOrder;
      throw new ApiError(statusCode, message);
    }

    // Check if order is delivered
    if (order.isDelivered()) {
      const statusCode = httpStatus.BAD_REQUEST;
      const message = errors.rentOrder.deleteDeliveredOrder;
      throw new ApiError(statusCode, message);
    }

    // Delete order
    await order.delete();

    // Delete order's transaction if it's approved
    if (order.isWaitingForPayment()) {
      await transactionsService.deleteOrderTransaction(order._id);
    }

    return { order, rentCar };
  } catch (err) {
    throw err;
  }
};

module.exports.payOrder = async (user, orderId) => {
  try {
    // Check if orders exists
    const order = await RentOrder.findById(orderId);
    if (!order) {
      const statusCode = httpStatus.NOT_FOUND;
      const message = errors.rentOrder.notFound;
      throw new ApiError(statusCode, message);
    }

    // Check if rent car exists
    const rentCar = await RentCar.findById(order.rentCar);
    if (!rentCar) {
      const statusCode = httpStatus.NOT_FOUND;
      const message = errors.rentCar.notFound;
      throw new ApiError(statusCode, message);
    }

    // Check if the user is the order owner
    const isOrderOwner = order.author.toString() === user._id.toString();
    if (!isOrderOwner) {
      const statusCode = httpStatus.FORBIDDEN;
      const message = errors.rentOrder.notOwner;
      throw new ApiError(statusCode, message);
    }

    // Check if order is paid and waiting for delivery
    if (!order.isWaitingForPayment()) {
      const statusCode = httpStatus.BAD_REQUEST;
      const message = errors.rentOrder.payUnapprovedOrder;
      throw new ApiError(statusCode, message);
    }

    // Mark order as paid and waiting for delivery
    order.pay();

    // Save order to the DB
    await order.save();

    // Mark order's transaction as complete
    await transactionsService.completeOrderTransaction(order._id);

    // Find office
    const office = await usersService.findUserById(order.office);

    // Add balance to office
    office.addBalance(order.deservedAmount.forOffice);

    // Save office to the DB
    await office.save();

    return { order, rentCar };
  } catch (err) {
    throw err;
  }
};

//////////////////// Office Services ////////////////////
module.exports.getMyReceivedOrders = async (office, page, limit) => {
  try {
    page = parseInt(page);
    limit = parseInt(limit);

    const orders = await RentOrder.aggregate([
      { $match: { office: office._id } },
      { $sort: { _id: -1 } },
      { $skip: (page - 1) * limit },
      { $limit: limit },
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

    const results = await RentOrder.aggregate([
      { $match: { office: office._id } },
    ]);
    const count = results.length;

    return {
      orders,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
    };
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

    // Check if rent car exists
    const rentCar = await RentCar.findById(order.rentCar);
    if (!rentCar) {
      const statusCode = httpStatus.NOT_FOUND;
      const message = errors.rentCar.notFound;
      throw new ApiError(statusCode, message);
    }

    // Check if the user is the receiver office
    const isOfficeReceiver = order.office.toString() === office._id.toString();
    if (!isOfficeReceiver) {
      const statusCode = httpStatus.FORBIDDEN;
      const message = errors.rentOrder.notReceiverOffice;
      throw new ApiError(statusCode, message);
    }

    // Check if order is already approved
    if (order.isWaitingForPayment()) {
      const statusCode = httpStatus.BAD_REQUEST;
      const message = errors.rentOrder.alreadyApproved;
      throw new ApiError(statusCode, message);
    }

    // Check if order is waiting waiting for approval
    if (!order.isWaitingForApproval()) {
      const statusCode = httpStatus.BAD_REQUEST;
      const message = errors.rentOrder.isNotPending;
      throw new ApiError(statusCode, message);
    }

    // Approve order
    order.approve();

    // Save order to the DB
    await order.save();

    return { order, rentCar };
  } catch (err) {
    throw err;
  }
};

module.exports.rejectOrder = async (office, orderId, rejectionReason) => {
  try {
    // Check if orders exists
    const order = await RentOrder.findById(orderId);
    if (!order) {
      const statusCode = httpStatus.NOT_FOUND;
      const message = errors.rentOrder.notFound;
      throw new ApiError(statusCode, message);
    }

    // Check if rent car exists
    const rentCar = await RentCar.findById(order.rentCar);
    if (!rentCar) {
      const statusCode = httpStatus.NOT_FOUND;
      const message = errors.rentCar.notFound;
      throw new ApiError(statusCode, message);
    }

    // Check if the user is the receiver office
    const isOfficeReceiver = order.office.toString() === office._id.toString();
    if (!isOfficeReceiver) {
      const statusCode = httpStatus.NOT_FOUND;
      const message = errors.rentOrder.notReceiverOffice;
      throw new ApiError(statusCode, message);
    }

    // Check if order is already rejected
    if (order.isRejected()) {
      const statusCode = httpStatus.NOT_FOUND;
      const message = errors.rentOrder.alreadyRejected;
      throw new ApiError(statusCode, message);
    }

    // Check if order is waiting waiting for approval
    // or waiting for payment
    if (!order.isWaitingForApproval() || !order.isWaitingForPayment()) {
      const statusCode = httpStatus.BAD_REQUEST;
      const message = errors.rentOrder.isNotPending;
      throw new ApiError(statusCode, message);
    }

    // Reject order
    order.reject();

    // Add rejection reason
    order.reasonFor.rejection = rejectionReason;

    // Save order to the DB
    await order.save();

    return { order, rentCar };
  } catch (err) {
    throw err;
  }
};

module.exports.deliverOrder = async (office, orderId) => {
  try {
    // Check if orders exists
    const order = await RentOrder.findById(orderId);
    if (!order) {
      const statusCode = httpStatus.NOT_FOUND;
      const message = errors.rentOrder.notFound;
      throw new ApiError(statusCode, message);
    }

    // Check if rent car exists
    const rentCar = await RentCar.findById(order.rentCar);
    if (!rentCar) {
      const statusCode = httpStatus.NOT_FOUND;
      const message = errors.rentCar.notFound;
      throw new ApiError(statusCode, message);
    }

    // Check if the user is the receiver office
    const isOfficeReceiver = order.office.toString() === office._id.toString();
    if (!isOfficeReceiver) {
      const statusCode = httpStatus.FORBIDDEN;
      const message = errors.rentOrder.notReceiverOffice;
      throw new ApiError(statusCode, message);
    }

    // Check if order is waiting for delivery
    if (!order.isWaitingForDelivery()) {
      const statusCode = httpStatus.BAD_REQUEST;
      const message = errors.rentOrder.deliverUnpaidOrder;
      throw new ApiError(statusCode, message);
    }

    // Approve order
    order.deliver();

    // Save order to the DB
    await order.save();

    return { order, rentCar };
  } catch (err) {
    throw err;
  }
};

//////////////////// Admin Services ////////////////////
module.exports.getAllOrders = async (skip = 0) => {
  try {
    const orders = await RentOrder.aggregate([
      { $match: { status: { $not: { $eq: "closed" } } } },
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
      const message = errors.rentOrder.noAddedOrders;
      throw new ApiError(statusCode, message);
    }

    return orders;
  } catch (err) {
    throw err;
  }
};
