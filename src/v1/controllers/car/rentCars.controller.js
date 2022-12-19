const { CLIENT_SCHEMA } = require("../../models/car/rentCar.model");
const { rentCarsService } = require("../../services");
const httpStatus = require("http-status");
const _ = require("lodash");

module.exports.getAllCars = async (req, res, next) => {
  try {
    const { skip } = req.query;

    const cars = await rentCarsService.getAllCars(skip);

    const response = {
      cars: cars.map((car) => _.pick(car, CLIENT_SCHEMA)),
    };

    res.status(httpStatus.OK).json(response);
  } catch (err) {
    next(err);
  }
};

module.exports.getCar = async (req, res, next) => {
  try {
    const { carId } = req.query;

    const car = await rentCarsService.getCar(carId);

    const response = _.pick(car, CLIENT_SCHEMA);

    res.status(httpStatus.OK).json(response);
  } catch (err) {
    next(err);
  }
};

module.exports.searchCars = async (req, res, next) => {
  try {
    const { searchTerm, skip } = req.query;

    const cars = await rentCarsService.searchCars(searchTerm, skip);

    const response = {
      cars: cars.map((car) => _.pick(car, CLIENT_SCHEMA)),
    };

    res.status(httpStatus.OK).json(response);
  } catch (err) {
    next(err);
  }
};
