const { ordersService } = require("../../services");
const { CLIENT_SCHEMA: orderSchema } = require("../../models/user/user.model");
const httpStatus = require("http-status");
const _ = require("lodash");

module.exports.getMyOrders = async (req, res, next) => {
  try {
    const user = req.user;
    const { skip } = req.query;

    const orders = await ordersService.getMyOrders(user, skip);

    const response = {
      orders: orders.map((order) => _.pick(order, orderSchema)),
    };

    res.status(httpStatus.OK).json(response);
  } catch (err) {
    next(err);
  }
};
