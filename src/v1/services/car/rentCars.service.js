const { RentCar } = require("../../models/car/rentCar.model");
const { ApiError } = require("../../middleware/apiError");
const httpStatus = require("http-status");
const errors = require("../../config/errors");

module.exports.getAllCars = async (skip) => {
  try {
    const cars = await RentCar.find({}).sort({ _id: -1 }).limit(10).skip(skip);
    if (!cars || !cars.length) {
      const statusCode = httpStatus.NOT_FOUND;
      const message = errors.rentCar.noCars;
      throw new ApiError(statusCode, message);
    }

    return cars;
  } catch (err) {
    throw err;
  }
};

module.exports.getCar = async (carId) => {
  try {
    const car = await RentCar.findById(carId);
    if (!car) {
      const statusCode = httpStatus.NOT_FOUND;
      const message = errors.rentCar.notFound;
      throw new ApiError(statusCode, message);
    }

    return car;
  } catch (err) {
    throw err;
  }
};

module.exports.searchCars = async (searchTerm, skip) => {
  try {
    const cars = await RentCar.aggregate([
      { $match: { $text: { $search: searchTerm } } },
      { $sort: { score: { $meta: "textScore" } } },
      { $skip: skip },
      { $limit: 10 },
    ]);

    if (!cars || !cars.length) {
      const statusCode = httpStatus.NOT_FOUND;
      const message = errors.rentCar.noSearchCars;
      throw new ApiError(statusCode, message);
    }

    return car;
  } catch (err) {
    throw err;
  }
};
