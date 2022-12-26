const router = require("express").Router();
const { purchaseCarsController } = require("../../controllers");
const { purchaseCarValidator } = require("../../middleware/validation");
const auth = require("../../middleware/auth");

//////////////////// User Routes ////////////////////
router.get(
  "/details/:carId",
  purchaseCarValidator.getPurchaseCarDetailsValidator,
  purchaseCarsController.getPurchaseCarDetails
);

router.get(
  "/recently-arrived",
  purchaseCarValidator.getRecentlyArrivedPurchaseCarsValidator,
  purchaseCarsController.getRecentlyArrivedPurchaseCars
);

router.get(
  "/latest-models",
  purchaseCarValidator.getLatestModelsPurchaseCarsValidator,
  purchaseCarsController.getLatestModelsPurchaseCars
);

router.get(
  "/best-seller",
  purchaseCarValidator.getBestSellerPurchaseCarsValidator,
  purchaseCarsController.getBestSellerPurchaseCars
);

router.get(
  "/search",
  purchaseCarValidator.searchPurchaseCarsValidator,
  purchaseCarsController.searchPurchaseCars
);

router.get(
  "/my",
  auth("readOwn", "purchaseCar"),
  purchaseCarsController.getMyPurchaseCars
);

router.post(
  "/add",
  auth("createOwn", "purchaseCar"),
  purchaseCarsController.addPurchaseCar
);

module.exports = router;
