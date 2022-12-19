const router = require("express").Router();
const { rentCarsController } = require("../../controllers");
const { authValidator } = require("../../middleware/validation");
const auth = require("../../middleware/auth");

//////////////////// User Routes ////////////////////
router.get("/get", rentCarsController.getAllCars);

router.get("/:carId", rentCarsController.getCar);

router.get("/similar", rentCarsController.getSimilarCars);

router.get("/search", rentCarsController.searchCars);

// TODO:
router.post(
  "/rent",
  auth("createOwn", "rentOrder"),
  rentCarsController.requestCarRental
);

//////////////////// Office Routes ////////////////////
router.get("/my", auth("readOwn", "rentCar"), rentCarsController.getMyCars);

// TODO:
router.post("/add", auth("createAny", "rentCar"), rentCarsController.addCar);

module.exports = router;
