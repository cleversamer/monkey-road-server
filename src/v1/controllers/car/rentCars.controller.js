const {
  CLIENT_SCHEMA: rentCarSchema,
} = require("../../models/car/rentCar.model");
const {
  CLIENT_SCHEMA: orderSchema,
} = require("../../models/car/rentOrder.model");
const { rentCarsService } = require("../../services");
const httpStatus = require("http-status");
const _ = require("lodash");

//////////////////// User Controllers ////////////////////
module.exports.getAllRentCars = async (req, res, next) => {
  try {
    const { skip } = req.query;

    const cars = await rentCarsService.getAllRentCars(skip);

    const response = {
      cars: cars.map((car) => _.pick(car, rentCarSchema)),
    };

    res.status(httpStatus.OK).json(response);
  } catch (err) {
    next(err);
  }
};

module.exports.getRentCarDetails = async (req, res, next) => {
  try {
    const { carId } = req.params;

    const car = await rentCarsService.getRentCarDetails(carId);

    const response = _.pick(car, rentCarSchema);

    res.status(httpStatus.OK).json(response);
  } catch (err) {
    next(err);
  }
};

module.exports.getSimilarRentCars = async (req, res, next) => {
  try {
    const { carId } = req.params;
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

    const cars = await rentCarsService.getSimilarRentCars(
      carId,
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

module.exports.searchRentCars = async (req, res, next) => {
  try {
    const { searchTerm, skip } = req.query;

    const cars = await rentCarsService.searchRentCars(searchTerm, skip);

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
    const { carId: rentCarId } = req.params;
    const {
      startDate,
      noOfDays,
      locationTitle,
      longitude,
      latitude,
      fullName,
      phone,
    } = req.body;

    const order = await rentCarsService.requestCarRental(
      user,
      rentCarId,
      startDate,
      noOfDays,
      locationTitle,
      longitude,
      latitude,
      fullName,
      phone
    );

    const response = _.pick(order, orderSchema);

    res.status(httpStatus.CREATED).json(response);
  } catch (err) {
    next(err);
  }
};

//////////////////// Office Controllers ////////////////////
module.exports.getMyRentCars = async (req, res, next) => {
  try {
    const user = req.user;
    const { skip } = req.query;

    const myCars = await rentCarsService.getMyRentCars(user, skip);

    const response = {
      cars: myCars.map((car) => _.pick(car, rentCarSchema)),
    };

    res.status(httpStatus.OK).json(response);
  } catch (err) {
    next(err);
  }
};

module.exports.addRentCar = async (req, res, next) => {
  try {
    const user = req.user;
    const {
      carName,
      model,
      colorEN,
      colorAR,
      brandId,
      year,
      dailyPrice,
      weeklyPrice,
      monthlyPrice,
      deposit,
      description,
    } = req.body;
    const photo1 = req?.files?.photo1;
    const photo2 = req?.files?.photo2;
    const photo3 = req?.files?.photo3;
    const photo4 = req?.files?.photo4;
    const photo5 = req?.files?.photo5;
    const photo6 = req?.files?.photo6;

    const rentCar = await rentCarsService.addRentCar(
      user,
      carName,
      model,
      colorEN,
      colorAR,
      brandId,
      year,
      dailyPrice,
      weeklyPrice,
      monthlyPrice,
      deposit,
      description,
      photo1,
      photo2,
      photo3,
      photo4,
      photo5,
      photo6
    );

    const response = _.pick(rentCar, rentCarSchema);

    res.status(httpStatus.OK).json(response);
  } catch (err) {
    next(err);
  }
};

//////////////////// Admin Controllers ////////////////////
module.exports.getNotAcceptedRentCars = async (req, res, next) => {
  try {
    const { skip } = req.query;

    const cars = await rentCarsService.getNotAcceptedRentCars(skip);

    const response = {
      cars: cars.map((car) => _.pick(car, rentCarSchema)),
    };

    res.status(httpStatus.OK).json(response);
  } catch (err) {
    next(err);
  }
};

module.exports.acceptRentCar = async (req, res, next) => {
  try {
    const { carId } = req.params;

    const car = await rentCarsService.acceptRentCar(carId);

    const response = _.pick(car, rentCarSchema);

    res.status(httpStatus.OK).json(response);
  } catch (err) {
    next(err);
  }
};

module.exports.rejectRentCar = async (req, res, next) => {
  try {
    const { carId } = req.params;

    const car = await rentCarsService.rejectRentCar(carId);

    const response = _.pick(car, rentCarSchema);

    res.status(httpStatus.OK).json(response);
  } catch (err) {
    next(err);
  }
};
