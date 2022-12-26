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
  "/:orderId/cancel",
  orderValidator.cancelOrderValidator,
  auth("deleteOwn", "order"),
  ordersController.cancelOrder
);

router.delete(
  "/:orderId/delete",
  orderValidator.deleteOrderValidator,
  auth("deleteOwn", "order"),
  ordersController.deleteOrder
);

//////////////////// Rent Car Routes ////////////////////
// TODO:
// router.post(
//   "/complete",
//   auth("updateOwn", "order"),
//   ordersController.completeOrder
// );

//////////////////// Purchase Car Routes ////////////////////

module.exports = router;
