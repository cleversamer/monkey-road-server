const router = require("express").Router();
const { ordersController } = require("../../controllers");
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

// TODO: implement payment methods
// router.post(
//   "/complete",
//   auth("updateOwn", "order"),
//   ordersController.completeOrder
// );

//////////////////// Office Routes ////////////////////
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

module.exports = router;
