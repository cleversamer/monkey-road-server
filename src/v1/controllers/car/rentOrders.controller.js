const {
  rentOrdersService: ordersService,
  usersService,
  transactionsService,
} = require("../../services");
const {
  CLIENT_SCHEMA: orderSchema,
} = require("../../models/car/rentOrder.model");
const {
  CLIENT_SCHEMA: rentCarSchema,
} = require("../../models/car/rentCar.model");
const { CLIENT_SCHEMA: userSchema } = require("../../models/user/user.model");
const httpStatus = require("http-status");
const _ = require("lodash");
const { notifications, success, transactions } = require("../../config");

//////////////////// Common Routes ////////////////////
module.exports.getMyOrders = async (req, res, next) => {
  try {
    const user = req.user;
    const { skip } = req.query;

    const orders = await ordersService.getMyOrders(user, skip);

    const response = {
      orders: orders.map((order) => {
        const mappedOrder = {
          ...order,
          office: _.pick(order.office[0], userSchema),
          rentCar: _.pick(order.rentCar, rentCarSchema),
        };

        return _.pick(mappedOrder, orderSchema);
      }),
    };

    res.status(httpStatus.OK).json(response);
  } catch (err) {
    next(err);
  }
};

module.exports.getOrderDetails = async (req, res, next) => {
  try {
    const user = req.user;
    const { orderId } = req.params;

    const order = await ordersService.getOrderDetails(user, orderId);

    const mappedOrder = {
      ...order,
      office: _.pick(order.office[0], userSchema),
      rentCar: _.pick(order.rentCar, rentCarSchema),
    };

    const response = _.pick(mappedOrder, orderSchema);

    res.status(httpStatus.OK).json(response);
  } catch (err) {
    next(err);
  }
};

module.exports.closeOrder = async (req, res, next) => {
  try {
    const user = req.user;
    const { orderId } = req.params;

    const { rentCar } = await ordersService.closeOrder(user, orderId);

    // Send notification to user
    const notificationForUser = notifications.rentOrder.orderClosedForUser(
      rentCar.photos[0]
    );
    await usersService.sendNotification([user._id], notificationForUser);

    const response = success.rentOrder.orderClosed;

    res.status(httpStatus.OK).json(response);
  } catch (err) {
    next(err);
  }
};

module.exports.deleteOrder = async (req, res, next) => {
  try {
    const user = req.user;
    const { orderId } = req.params;

    const { rentCar } = await ordersService.deleteOrder(user, orderId);

    // Send notification to user
    const notificationForUser = notifications.rentOrder.orderDeletedForUser(
      rentCar.photos[0]
    );
    await usersService.sendNotification([user._id], notificationForUser);

    const response = success.rentOrder.orderDeleted;

    res.status(httpStatus.OK).json(response);
  } catch (err) {
    next(err);
  }
};

module.exports.payOrder = async (req, res, next) => {
  try {
    const user = req.user;
    const { orderId } = req.params;

    const { order, rentCar } = await ordersService.payOrder(user, orderId);

    // Send notification to admin
    const notificationForAdmin =
      notifications.rentCars.rentalRequestPaidForAdmin(rentCar.photos[0]);
    await usersService.sendNotificationToAdmins(notificationForAdmin);

    // Send notification to office
    const notificationForOffice =
      notifications.rentCars.rentalRequestPaidForOffice(rentCar.photos[0]);
    await usersService.sendNotification([order.office], notificationForOffice);

    // Send notification to user
    const notificationForUser = notifications.rentCars.rentalRequestPaidForUser(
      rentCar.photos[0]
    );
    await usersService.sendNotification([order.author], notificationForUser);

    // Send transaction notification to user
    const transactionNotificationForUser =
      notifications.rentCars.transactionNotificationComplete();
    await usersService.sendNotification(
      [order.author],
      transactionNotificationForUser
    );

    const response = success.rentOrder.orderPaid;

    res.status(httpStatus.OK).json(response);
  } catch (err) {
    next(err);
  }
};

//////////////////// Office Controllers ////////////////////
module.exports.getMyReceivedOrders = async (req, res, next) => {
  try {
    const office = req.user;
    const { skip } = req.query;

    const orders = await ordersService.getMyReceivedOrders(office, skip);

    const response = {
      orders: orders.map((order) => {
        const mappedOrder = {
          ...order,
          phoneNumber: "",
          rentCar: _.pick(order.rentCar, rentCarSchema),
        };

        return _.pick(mappedOrder, orderSchema);
      }),
    };

    res.status(httpStatus.OK).json(response);
  } catch (err) {
    next(err);
  }
};

module.exports.approveOrder = async (req, res, next) => {
  try {
    const office = req.user;
    const { orderId } = req.params;

    const { order, rentCar } = await ordersService.approveOrder(
      office,
      orderId
    );

    // Send notification to admin
    const notificationForAdmin =
      notifications.rentCars.rentalRequestApprovedForAdmin(rentCar.photos[0]);
    await usersService.sendNotificationToAdmins(notificationForAdmin);

    // Send notification to office
    const notificationForOffice =
      notifications.rentCars.rentalRequestApprovedForOffice(rentCar.photos[0]);
    await usersService.sendNotification([office._id], notificationForOffice);

    // Send notification to user
    const notificationForUser =
      notifications.rentCars.rentalRequestApprovedForUser(rentCar.photos[0]);
    await usersService.sendNotification([order.author], notificationForUser);

    await transactionsService.createTransaction(
      order.author,
      office._id,
      order._id,
      transactions.rentalOrderPayment(order.noOfDays),
      order.totalPrice
    );

    // Send transaction notification to user
    const transactionNotificationForUser =
      notifications.rentCars.transactionNotificationIncomplete();
    await usersService.sendNotification(
      [order.author],
      transactionNotificationForUser
    );

    const response = success.rentOrder.orderApproved;

    res.status(httpStatus.OK).json(response);
  } catch (err) {
    next(err);
  }
};

module.exports.rejectOrder = async (req, res, next) => {
  try {
    const office = req.user;
    const { orderId } = req.params;
    const { rejectionReason } = req.body;

    const { order, rentCar } = await ordersService.rejectOrder(
      office,
      orderId,
      rejectionReason
    );

    // Send notification to admin
    const notificationForAdmin =
      notifications.rentCars.rentalRequestRejectedForAdmin(
        rejectionReason,
        rentCar.photos[0]
      );
    await usersService.sendNotificationToAdmins(notificationForAdmin);

    // Send notification to office
    const notificationForOffice =
      notifications.rentCars.rentalRequestRejectedForOffice(
        rejectionReason,
        rentCar.photos[0]
      );
    await usersService.sendNotification([office._id], notificationForOffice);

    // Send notification to user
    const notificationForUser =
      notifications.rentCars.rentalRequestRejectedForUser(
        rejectionReason,
        rentCar.photos[0]
      );
    await usersService.sendNotification([order.author], notificationForUser);

    const response = success.rentOrder.orderRejected;

    res.status(httpStatus.OK).json(response);
  } catch (err) {
    next(err);
  }
};

module.exports.deliverOrder = async (req, res, next) => {
  try {
    const office = req.user;
    const { orderId } = req.params;

    const { order, rentCar } = await ordersService.deliverOrder(
      office,
      orderId
    );

    // Send notification to admin
    const notificationForAdmin =
      notifications.rentCars.rentalRequestDeliveredForAdmin(
        rejectionReason,
        rentCar.photos[0]
      );
    await usersService.sendNotificationToAdmins(notificationForAdmin);

    // Send notification to office
    const notificationForOffice =
      notifications.rentCars.rentalRequestDeliveredForOffice(
        rejectionReason,
        rentCar.photos[0]
      );
    await usersService.sendNotification([office._id], notificationForOffice);

    // Send notification to user
    const notificationForUser =
      notifications.rentCars.rentalRequestDeliveredForUser(
        rejectionReason,
        rentCar.photos[0]
      );
    await usersService.sendNotification([order.author], notificationForUser);

    const response = success.rentOrder.orderDelivered;

    res.status(httpStatus.OK).json(response);
  } catch (err) {
    next(err);
  }
};

//////////////////// Admin Controllers ////////////////////
module.exports.getAllOrders = async (req, res, next) => {
  try {
    const { skip } = req.query;

    const orders = await ordersService.getAllOrders(skip);

    const response = {
      orders: orders.map((order) => {
        const mappedOrder = {
          ...order,
          office: _.pick(order.office[0], userSchema),
          rentCar: _.pick(order.rentCar, rentCarSchema),
        };

        return _.pick(mappedOrder, orderSchema);
      }),
    };

    res.status(httpStatus.OK).json(response);
  } catch (err) {
    next(err);
  }
};
