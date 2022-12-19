const router = require("express").Router();
const { purchaseCarsController } = require("../../controllers");
const { authValidator } = require("../../middleware/validation");
const auth = require("../../middleware/auth");

//////////////////// User Routes ////////////////////
router.get("/:carId", purchaseCarsController.getCar);

router.get("/recently-arrived", purchaseCarsController.getRecentlyArrivedCars);

// TODO:
router.get("/latest-models", purchaseCarsController.getLatestCars);

// TODO:
router.get("/best-seller", purchaseCarsController.getBestSellerCars);

// TODO:
router.get("/search", purchaseCarsController.searchRentCars);

// TODO:
router.get(
  "/my",
  auth("readOwn", "purchaseCar"),
  purchaseCarsController.getMyCars
);

// TODO:
router.post(
  "/add",
  auth("createAny", "purchaseCar"),
  purchaseCarsController.addRentCar
);

module.exports = router;
