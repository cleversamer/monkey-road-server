const router = require("express").Router();
const { purchaseCarsController } = require("../../controllers");
const auth = require("../../middleware/auth");

//////////////////// User Routes ////////////////////
router.get("/details/:carId", purchaseCarsController.getCarDetails);

router.get("/recently-arrived", purchaseCarsController.getRecentlyArrivedCars);

router.get("/latest-models", purchaseCarsController.getLatestModelsCars);

router.get("/best-seller", purchaseCarsController.getBestSellerCars);

router.get("/search", purchaseCarsController.searchRentCars);

router.get(
  "/my",
  auth("readOwn", "purchaseCar"),
  purchaseCarsController.getMyCars
);

router.post(
  "/add",
  auth("createOwn", "purchaseCar"),
  purchaseCarsController.addCar
);

module.exports = router;
