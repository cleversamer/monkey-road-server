const router = require("express").Router();
const { rentCarsController } = require("../../controllers");
const auth = require("../../middleware/auth");

//////////////////// User Routes ////////////////////
router.get("/get", rentCarsController.getAllRentCars);

router.get("/details/:carId", rentCarsController.getRentCarDetails);

router.get("/similar", rentCarsController.getSimilarRentCars);

router.get("/search", rentCarsController.searchRentCars);

// TODO: waiting for order apis
// router.post(
//   "/rent",
//   auth("createOwn", "rentOrder"),
//   rentCarsController.requestCarRental
// );

//////////////////// Office Routes ////////////////////
router.get("/my", auth("readOwn", "rentCar"), rentCarsController.getMyRentCars);

// TODO: waiting for brand apis
// router.post("/add", auth("createOwn", "rentCar"), rentCarsController.addRentCar);

module.exports = router;
