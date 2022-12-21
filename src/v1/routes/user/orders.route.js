const router = require("express").Router();
const { ordersController } = require("../../controllers");
const { authValidator } = require("../../middleware/validation");
const auth = require("../../middleware/auth");

//////////////////// Common Routes ////////////////////
router.get("/my", auth("readOwn", "order"), ordersController.getMyOrders);

router.get(
  "/:orderId/details",
  auth("readOwn", "order"),
  ordersController.getOrder
);

router.delete(
  "/cancel",
  auth("deleteOwn", "order"),
  ordersController.cancelOrder
);

// TODO:
router.delete(
  "/delete",
  auth("deleteOwn", "order"),
  ordersController.deleteOrder
);

//////////////////// Rent Car Routes ////////////////////
// TODO:
router.post(
  "/complete",
  auth("updateOwn", "order"),
  ordersController.completeOrder
);

//////////////////// Purchase Car Routes ////////////////////

module.exports = router;
