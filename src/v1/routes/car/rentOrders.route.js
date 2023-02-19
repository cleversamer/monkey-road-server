const router = require("express").Router();
const { rentOrdersController: ordersController } = require("../../controllers");
const { orderValidator } = require("../../middleware/validation");
const auth = require("../../middleware/auth");

//////////////////// Common Routes ////////////////////
router.get(
  "/my",
  orderValidator.getMyOrdersValidator,
  auth("readOwn", "order"),
  ordersController.getMyOrders
);

router.get(
  "/:orderId/details",
  orderValidator.getOrderDetailsValidator,
  auth("readOwn", "order"),
  ordersController.getOrderDetails
);

router.patch(
  "/:orderId/close",
  orderValidator.closeOrderValidator,
  auth("deleteOwn", "order"),
  ordersController.closeOrder
);

router.delete(
  "/:orderId/delete",
  orderValidator.deleteOrderValidator,
  auth("deleteOwn", "order"),
  ordersController.deleteOrder
);

router.post(
  "/:orderId/pay",
  orderValidator.payOrderValidator,
  auth("updateOwn", "order"),
  ordersController.payOrder
);

//////////////////// Office Routes ////////////////////
router.get(
  "/my-received",
  orderValidator.getMyReceivedOrdersValidator,
  auth("readOwn", "order"),
  ordersController.getMyReceivedOrders
);

router.patch(
  "/:orderId/approve",
  orderValidator.approveOrderValidator,
  auth("updateOwn", "order"),
  ordersController.approveOrder
);

router.patch(
  "/:orderId/reject",
  orderValidator.rejectOrderValidator,
  auth("updateOwn", "order"),
  ordersController.rejectOrder
);

router.patch(
  "/:orderId/deliver",
  orderValidator.deliverOrderValidator,
  auth("updateOwn", "order"),
  ordersController.deliverOrder
);

//////////////////// Admin Routes ////////////////////
router.get(
  "/admin/all",
  orderValidator.getAllOrdersValidator,
  auth("readAny", "order"),
  ordersController.getAllOrders
);

module.exports = router;
