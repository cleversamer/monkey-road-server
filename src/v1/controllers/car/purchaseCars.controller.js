const {
  CLIENT_SCHEMA: purchaseCarSchema,
} = require("../../models/car/purchaseCar.model");
const { purchaseCarsService } = require("../../services");
const httpStatus = require("http-status");
const _ = require("lodash");

module.exports.getCar = async (req, res, next) => {
  try {
    const { carId } = req.query;

    const car = await purchaseCarsService.getCar(carId);

    const response = _.pick(car, purchaseCarSchema);

    res.status(httpStatus.OK).json(response);
  } catch (err) {
    next(err);
  }
};

module.exports.getRecentlyArrivedCars = async (req, res, next) => {
  try {
    const { skip } = req.query;

    const cars = await purchaseCarsService.getRecentlyArrivedCars(skip);

    const response = {
      cars: cars.map((car) => _.pick(car, purchaseCarSchema)),
    };

    res.status(httpStatus.OK).json(response);
  } catch (err) {
    next(err);
  }
};

module.exports.getLatestModelsCars = async (req, res, next) => {
  try {
    const { skip } = req.query;

    const cars = await purchaseCarsService.getLatestModelsCars(skip);

    const response = {
      cars: cars.map((car) => _.pick(car, purchaseCarSchema)),
    };

    res.status(httpStatus.OK).json(response);
  } catch (err) {
    next(err);
  }
};
