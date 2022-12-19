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

module.exports.getBestSellerCars = async (req, res, next) => {
  try {
    const { skip } = req.query;

    const cars = await purchaseCarsService.getBestSellerCars(skip);

    const response = {
      cars: cars.map((car) => _.pick(car, purchaseCarSchema)),
    };

    res.status(httpStatus.OK).json(response);
  } catch (err) {
    next(err);
  }
};

module.exports.searchRentCars = async (req, res, next) => {
  try {
    const { searchTerm, skip } = req.query;

    const cars = await purchaseCarsService.searchRentCars(searchTerm, skip);

    const response = {
      cars: cars.map((car) => _.pick(car, purchaseCarSchema)),
    };

    res.status(httpStatus.OK).json(response);
  } catch (err) {
    next(err);
  }
};

module.exports.getMyCars = async (req, res, next) => {
  try {
    const user = req.user;

    const cars = await purchaseCarsService.getMyCars(user);

    const response = {
      cars: cars.map((car) => _.pick(car, purchaseCarSchema)),
    };

    res.status(httpStatus.OK).json(response);
  } catch (err) {
    next(err);
  }
};

module.exports.addCar = async (req, res, next) => {
  try {
    const user = req.user;
    const {
      name,
      vin,
      model,
      brandId,
      year,
      color,
      trimLevel,
      vehicleType,
      fuelType,
      noOfSeats,
      kiloPerHour,
      price,
      phoneNumber,
      description,
    } = req.body;
    const photo1 = req?.files?.photo1;
    const photo2 = req?.files?.photo2;
    const photo3 = req?.files?.photo3;
    const photo4 = req?.files?.photo4;
    const photo5 = req?.files?.photo5;
    const photo6 = req?.files?.photo6;

    const car = await purchaseCarsService.addCar(
      user,
      name,
      vin,
      model,
      brandId,
      year,
      color,
      trimLevel,
      vehicleType,
      fuelType,
      noOfSeats,
      kiloPerHour,
      price,
      phoneNumber,
      description,
      photo1,
      photo2,
      photo3,
      photo4,
      photo5,
      photo6
    );

    const response = _.pick(car, purchaseCarSchema);

    res.status(httpStatus.OK).json(response);
  } catch (err) {
    next(err);
  }
};
