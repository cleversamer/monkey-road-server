const router = require("express").Router();
const { purchaseCarsController } = require("../../controllers");
const auth = require("../../middleware/auth");

//////////////////// User Routes ////////////////////
router.get("/details/:carId", purchaseCarsController.getPurchaseCarDetails);

router.get(
  "/recently-arrived",
  purchaseCarsController.getRecentlyArrivedPurchaseCars
);

router.get(
  "/latest-models",
  purchaseCarsController.getLatestModelsPurchaseCars
);

router.get("/best-seller", purchaseCarsController.getBestSellerPurchaseCars);

router.get("/search", purchaseCarsController.searchPurchaseCars);

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
