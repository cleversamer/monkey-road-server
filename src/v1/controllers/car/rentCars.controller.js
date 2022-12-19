const {
  CLIENT_SCHEMA: rentCarSchema,
} = require("../../models/car/rentCar.model");
const { CLIENT_SCHEMA: orderSchema } = require("../../models/user/order.model");
const { rentCarsService } = require("../../services");
const httpStatus = require("http-status");
const _ = require("lodash");

//////////////////// User Controllers ////////////////////
module.exports.getAllCars = async (req, res, next) => {
  try {
    const { skip } = req.query;

    const cars = await rentCarsService.getAllCars(skip);

    const response = {
      cars: cars.map((car) => _.pick(car, rentCarSchema)),
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

    const response = _.pick(car, rentCarSchema);

    res.status(httpStatus.OK).json(response);
  } catch (err) {
    next(err);
  }
};

module.exports.getSimilarCars = async (req, res, next) => {
  try {
    const {
      name,
      model,
      brandEN,
      brandAR,
      colorEN,
      colorAR,
      year,
      description,
    } = req.query;

    const cars = await rentCarsService.getSimilarCars(
      name,
      model,
      brandEN,
      brandAR,
      colorEN,
      colorAR,
      year,
      description
    );

    const response = {
      cars: cars.map((car) => _.pick(car, rentCarSchema)),
    };

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
      cars: cars.map((car) => _.pick(car, rentCarSchema)),
    };

    res.status(httpStatus.OK).json(response);
  } catch (err) {
    next(err);
  }
};

module.exports.requestCarRental = async (req, res, next) => {
  try {
    const user = req.user;
    const { rentCarId, startDate, noOfDays, location, fullName, phoneNumber } =
      req.body;

    const order = await rentCarsService.requestCarRental(
      user,
      rentCarId,
      startDate,
      noOfDays,
      location,
      fullName,
      phoneNumber
    );

    const response = _.pick(order, orderSchema);

    res.status(httpStatus.CREATED).json(response);
  } catch (err) {
    next(err);
  }
};

//////////////////// Office Controllers ////////////////////
module.exports.getMyCars = async (req, res, next) => {
  try {
    const user = req.user;
    const { skip } = req.query;

    const myCars = await rentCarsService.getMyCars(user, skip);

    const response = {
      cars: myCars.map((car) => _.pick(car, rentCarSchema)),
    };

    res.status(httpStatus.OK).json(response);
  } catch (erro) {
    next(err);
  }
};
