const router = require("express").Router();
const { rentCarsController } = require("../../controllers");
const { rentCarValidator } = require("../../middleware/validation");
const auth = require("../../middleware/auth");

//////////////////// Common Routes ////////////////////
router.get(
  "/get",
  rentCarValidator.getAllRentCarsValidator,
  rentCarsController.getAllRentCars
);

router.get(
  "/details/:carId",
  rentCarValidator.getRentCarDetailsValidator,
  rentCarsController.getRentCarDetails
);

router.get(
  "/:carId/similar",
  rentCarValidator.getSimilarRentCarsValidator,
  rentCarsController.getSimilarRentCars
);

router.get(
  "/search",
  rentCarValidator.searchRentCarsValidator,
  rentCarsController.searchRentCars
);

router.post(
  "/:carId/request",
  rentCarValidator.requestCarRentalValidator,
  auth("createOwn", "rentOrder"),
  rentCarsController.requestCarRental
);

//////////////////// Office Routes ////////////////////
router.get(
  "/my",
  rentCarValidator.getMyRentCarsValidator,
  auth("readOwn", "rentCar"),
  rentCarsController.getMyRentCars
);

router.post(
  "/add",
  rentCarValidator.addRentCarValidator,
  auth("createOwn", "rentCar"),
  rentCarsController.addRentCar
);

router.patch(
  "/:carId/archive",
  rentCarValidator.archiveRentCarValidator,
  auth("updateOwn", "rentCar"),
  rentCarsController.archiveRentCar
);

router.patch(
  "/:carId/restore",
  rentCarValidator.restoreRentCarValidator,
  auth("updateOwn", "rentCar"),
  rentCarsController.restoreRentCar
);

router.delete(
  "/:carId/delete",
  rentCarValidator.deleteRentCarValidator,
  auth("updateOwn", "rentCar"),
  rentCarsController.deleteRentCar
);

//////////////////// Admin Routes ////////////////////
router.get(
  "/not-accepted",
  rentCarValidator.getNotAcceptedRentCarsValidator,
  auth("updateAny", "rentCar"),
  rentCarsController.getNotAcceptedRentCars
);

router.patch(
  "/:carId/accept",
  rentCarValidator.acceptRentCarValidator,
  auth("updateAny", "rentCar"),
  rentCarsController.acceptRentCar
);

router.patch(
  "/:carId/reject",
  rentCarValidator.rejectRentCarValidator,
  auth("updateAny", "rentCar"),
  rentCarsController.rejectRentCar
);

module.exports = router;
