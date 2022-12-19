const router = require("express").Router();
const { ordersController } = require("../../controllers");
const { authValidator } = require("../../middleware/validation");
const auth = require("../../middleware/auth");

//////////////////// Common Routes ////////////////////
// TODO:
router.get("/my", auth("readOwn", "order"), ordersController.getMyOrders);

// TODO:
router.get(
  "/:orderId/details",
  auth("readOwn", "order"),
  ordersController.getOrder
);

// TODO:
router.delete(
  "/cancel",
  auth("deleteOwn", "order"),
  ordersController.cancelOrder
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
