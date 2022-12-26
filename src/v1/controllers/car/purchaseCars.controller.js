const {
  CLIENT_SCHEMA: purchaseCarSchema,
} = require("../../models/car/purchaseCar.model");
const { purchaseCarsService } = require("../../services");
const httpStatus = require("http-status");
const _ = require("lodash");

module.exports.getPurchaseCarDetails = async (req, res, next) => {
  try {
    const { carId } = req.query;

    const car = await purchaseCarsService.getPurchaseCarDetails(carId);

    const response = _.pick(car, purchaseCarSchema);

    res.status(httpStatus.OK).json(response);
  } catch (err) {
    next(err);
  }
};

module.exports.getRecentlyArrivedPurchaseCars = async (req, res, next) => {
  try {
    const { skip } = req.query;

    const cars = await purchaseCarsService.getRecentlyArrivedPurchaseCars(skip);

    const response = {
      cars: cars.map((car) => _.pick(car, purchaseCarSchema)),
    };

    res.status(httpStatus.OK).json(response);
  } catch (err) {
    next(err);
  }
};

module.exports.getLatestModelsPurchaseCars = async (req, res, next) => {
  try {
    const { skip } = req.query;

    const cars = await purchaseCarsService.getLatestModelsPurchaseCars(skip);

    const response = {
      cars: cars.map((car) => _.pick(car, purchaseCarSchema)),
    };

    res.status(httpStatus.OK).json(response);
  } catch (err) {
    next(err);
  }
};

module.exports.getBestSellerPurchaseCars = async (req, res, next) => {
  try {
    const { skip } = req.query;

    const cars = await purchaseCarsService.getBestSellerPurchaseCars(skip);

    const response = {
      cars: cars.map((car) => _.pick(car, purchaseCarSchema)),
    };

    res.status(httpStatus.OK).json(response);
  } catch (err) {
    next(err);
  }
};

module.exports.searchPurchaseCars = async (req, res, next) => {
  try {
    const { searchTerm, skip } = req.query;

    const cars = await purchaseCarsService.searchPurchaseCars(searchTerm, skip);

    const response = {
      cars: cars.map((car) => _.pick(car, purchaseCarSchema)),
    };

    res.status(httpStatus.OK).json(response);
  } catch (err) {
    next(err);
  }
};

module.exports.getMyPurchaseCars = async (req, res, next) => {
  try {
    const user = req.user;
    const { skip } = req.query;

    const cars = await purchaseCarsService.getMyPurchaseCars(user);

    const response = {
      cars: cars.map((car) => _.pick(car, purchaseCarSchema)),
    };

    res.status(httpStatus.OK).json(response);
  } catch (err) {
    next(err);
  }
};

module.exports.addPurchaseCar = async (req, res, next) => {
  try {
    const user = req.user;
    const {
      carName,
      vin,
      model,
      brandId,
      year,
      colorEN,
      colorAR,
      trimLevel,
      vehicleTypeEN,
      vehicleTypeAR,
      fuelTypeEN,
      fuelTypeAR,
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

    const car = await purchaseCarsService.addPurchaseCar(
      user,
      carName,
      vin,
      model,
      brandId,
      year,
      colorEN,
      colorAR,
      trimLevel,
      vehicleTypeEN,
      vehicleTypeAR,
      fuelTypeEN,
      fuelTypeAR,
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
