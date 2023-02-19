const {
  rentOrdersService: ordersService,
  usersService,
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
const { notifications } = require("../../config");

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

    await ordersService.closeOrder(user, orderId);

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

module.exports.deleteOrder = async (req, res, next) => {
  try {
    const user = req.user;
    const { orderId } = req.params;

    await ordersService.deleteOrder(user, orderId);

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

module.exports.payOrder = async (req, res, next) => {
  try {
    const user = req.user;
    const { orderId } = req.params;

    const order = await ordersService.payOrder(user, orderId);

    // Send notification to admin
    const notificationForAdmin =
      notifications.rentCars.rentalRequestPaidForAdmin;
    await usersService.sendNotificationToAdmins(notificationForAdmin);

    // Send notification to office
    const notificationForOffice =
      notifications.rentCars.rentalRequestPaidForOffice;
    await usersService.sendNotification([order.office], notificationForOffice);

    // Send notification to user
    const notificationForUser = notifications.rentCars.rentalRequestPaidForUser;
    await usersService.sendNotification([order.author], notificationForUser);

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

module.exports.approveOrder = async (req, res, next) => {
  try {
    const office = req.user;
    const { orderId } = req.params;

    const { order, rentCar } = await ordersService.approveOrder(
      office,
      orderId
    );

    // Send notification to admin
    const notificationForAdmin = notifications.rentCars.rentalRequestForAdmin(
      rentCar.photos[0]
    );
    await usersService.sendNotificationToAdmins(notificationForAdmin);

    // Send notification to office
    const notificationForOffice =
      notifications.rentCars.rentalRequestApprovedForOffice(rentCar.photos[0]);
    await usersService.sendNotification([office._id], notificationForOffice);

    // Send notification to user
    const notificationForUser =
      notifications.rentCars.rentalRequestApprovedForUser(rentCar.photos[0]);
    await usersService.sendNotification([order.author], notificationForUser);

    const orders = await ordersService.getMyReceivedOrders(office, skip);

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

module.exports.rejectOrder = async (req, res, next) => {
  try {
    const office = req.user;
    const { orderId } = req.params;
    const { rejectionReason } = req.body;

    const order = await ordersService.rejectOrder(
      office,
      orderId,
      rejectionReason
    );

    // Send notification to admin
    const notificationForAdmin = {
      ...notifications.rentCars.rentalRequestRejectedForAdmin,
      body: rejectionReason,
    };
    await usersService.sendNotificationToAdmins(notificationForAdmin);

    // Send notification to office
    const notificationForOffice = {
      ...notifications.rentCars.rentalRequestRejectedForOffice,
      body: rejectionReason,
    };
    await usersService.sendNotification([office._id], notificationForOffice);

    // Send notification to user
    const notificationForUser = {
      ...notifications.rentCars.rentalRequestRejectedForUser,
      body: rejectionReason,
    };
    await usersService.sendNotification([order.author], notificationForUser);

    const orders = await ordersService.getMyReceivedOrders(office, skip);

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

module.exports.deliverOrder = async (req, res, next) => {
  try {
    const office = req.user;
    const { orderId } = req.params;

    await ordersService.deliverOrder(office, orderId);

    const orders = await ordersService.getMyReceivedOrders(office, skip);

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
