const { PurchaseCar } = require("../../models/car/purchaseCar.model");
const localStorage = require("../../services/storage/localStorage.service");
const { ApiError } = require("../../middleware/apiError");
const httpStatus = require("http-status");
const errors = require("../../config/errors");

module.exports.getCar = async (carId) => {
  try {
    const purchaseCar = await PurchaseCar.findById(carId);
    if (!purchaseCar) {
      const statusCode = httpStatus.NOT_FOUND;
      const message = errors.purchaseCar.notFound;
      throw new ApiError(statusCode, message);
    }

    return purchaseCar;
  } catch (err) {
    throw err;
  }
};

module.exports.getRecentlyArrivedCars = async (skip) => {
  try {
    const purchaseCars = await PurchaseCar.find({})
      .sort({ _id: -1 })
      .skip(skip)
      .limit(10);
    if (!purchaseCars || !purchaseCars.length) {
      const statusCode = httpStatus.NOT_FOUND;
      const message = errors.purchaseCar.noCars;
      throw new ApiError(statusCode, message);
    }

    return purchaseCars;
  } catch (err) {
    throw err;
  }
};
