const { RentCar } = require("../../models/car/rentCar.model");
const { ApiError } = require("../../middleware/apiError");
const httpStatus = require("http-status");
const errors = require("../../config/errors");

//////////////////// User Services ////////////////////
module.exports.getAllCars = async (skip) => {
  try {
    const rentCars = await RentCar.find({})
      .sort({ _id: -1 })
      .limit(10)
      .skip(skip);
    if (!rentCars || !rentCars.length) {
      const statusCode = httpStatus.NOT_FOUND;
      const message = errors.rentCar.noCars;
      throw new ApiError(statusCode, message);
    }

    return rentCars;
  } catch (err) {
    throw err;
  }
};

module.exports.getCar = async (carId) => {
  try {
    const rentCar = await RentCar.findById(carId);
    if (!rentCar) {
      const statusCode = httpStatus.NOT_FOUND;
      const message = errors.rentCar.notFound;
      throw new ApiError(statusCode, message);
    }

    return rentCar;
  } catch (err) {
    throw err;
  }
};

module.exports.getSimilarCars = async (
  name,
  model,
  brandEN,
  brandAR,
  colorEN,
  colorAR,
  year,
  description
) => {
  try {
    const searchTerm = `${name} ${model} ${brandEN} ${brandAR} ${colorEN} ${colorAR} ${year} ${description}`;

    const rentCars = await RentCar.aggregate([
      { $match: { $text: { $search: searchTerm } } },
      { $sort: { score: { $meta: "textScore" } } },
      { $limit: 10 },
    ]);

    if (!rentCars || !rentCars.length) {
      const statusCode = httpStatus.NOT_FOUND;
      const message = errors.rentCar.noSimilarCars;
      throw new ApiError(statusCode, message);
    }

    return car;
  } catch (err) {
    throw err;
  }
};

module.exports.searchCars = async (searchTerm, skip) => {
  try {
    const rentCars = await RentCar.aggregate([
      { $match: { $text: { $search: searchTerm } } },
      { $sort: { score: { $meta: "textScore" } } },
      { $skip: skip },
      { $limit: 10 },
    ]);

    if (!rentCars || !rentCars.length) {
      const statusCode = httpStatus.NOT_FOUND;
      const message = errors.rentCar.noSearchCars;
      throw new ApiError(statusCode, message);
    }

    return car;
  } catch (err) {
    throw err;
  }
};

// TODO: complete this after completing order apis
module.exports.requestCarRental = async (
  user,
  rentCarId,
  startDate,
  noOfDays,
  location,
  fullName,
  phoneNumber
) => {
  try {
    const rentCar = await RentCar.findById(rentCarId);
    if (!rentCar) {
      const statusCode = httpStatus.NOT_FOUND;
      const message = errors.rentCar.notFound;
      throw new ApiError(statusCode, message);
    }
  } catch (err) {
    throw err;
  }
};
