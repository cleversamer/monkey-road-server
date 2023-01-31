const { rentOrdersService: ordersService } = require("../../services");
const {
  CLIENT_SCHEMA: orderSchema,
} = require("../../models/car/rentOrder.model");
const {
  CLIENT_SCHEMA: rentCarSchema,
} = require("../../models/car/rentCar.model");
const { CLIENT_SCHEMA: userSchema } = require("../../models/user/user.model");
const httpStatus = require("http-status");
const _ = require("lodash");

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

    const order = await ordersService.closeOrder(user, orderId);

    const response = _.pick(order, orderSchema);

    res.status(httpStatus.OK).json(response);
  } catch (err) {
    next(err);
  }
};

module.exports.deleteOrder = async (req, res, next) => {
  try {
    const user = req.user;
    const { orderId } = req.params;

    const order = await ordersService.deleteOrder(user, orderId);

    const response = _.pick(order, orderSchema);

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

    const order = await ordersService.approveOrder(office, orderId);

    const response = _.pick(order, orderSchema);

    res.status(httpStatus.OK).json(response);
  } catch (err) {
    next(err);
  }
};

module.exports.rejectOrder = async (req, res, next) => {
  try {
    const office = req.user;
    const { orderId } = req.params;

    const order = await ordersService.rejectOrder(office, orderId);

    const response = _.pick(order, orderSchema);

    res.status(httpStatus.OK).json(response);
  } catch (err) {
    next(err);
  }
};
