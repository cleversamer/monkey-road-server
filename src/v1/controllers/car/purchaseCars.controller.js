const {
  CLIENT_SCHEMA: purchaseCarSchema,
} = require("../../models/car/purchaseCar.model");
const { purchaseCarsService, usersService } = require("../../services");
const httpStatus = require("http-status");
const _ = require("lodash");
const { notifications } = require("../../config");

module.exports.getPurchaseCarDetails = async (req, res, next) => {
  try {
    const { carId } = req.params;

    const car = await purchaseCarsService.getPurchaseCarDetails(carId);

    const response = _.pick(car, purchaseCarSchema);

    res.status(httpStatus.OK).json(response);
  } catch (err) {
    next(err);
  }
};

module.exports.getRecentlyArrivedPurchaseCars = async (req, res, next) => {
  try {
    const { page, limit } = req.query;

    const { currentPage, totalPages, purchaseCars } =
      await purchaseCarsService.getRecentlyArrivedPurchaseCars(page, limit);

    const response = {
      currentPage,
      totalPages,
      purchaseCars: purchaseCars.map((car) => _.pick(car, purchaseCarSchema)),
    };

    res.status(httpStatus.OK).json(response);
  } catch (err) {
    next(err);
  }
};

module.exports.getLatestModelsPurchaseCars = async (req, res, next) => {
  try {
    const { page, limit } = req.query;

    const { currentPage, totalPages, purchaseCars } =
      await purchaseCarsService.getLatestModelsPurchaseCars(page, limit);

    const response = {
      currentPage,
      totalPages,
      purchaseCars: purchaseCars.map((car) => _.pick(car, purchaseCarSchema)),
    };

    res.status(httpStatus.OK).json(response);
  } catch (err) {
    next(err);
  }
};

module.exports.getBestSellerPurchaseCars = async (req, res, next) => {
  try {
    const { page, limit } = req.query;

    const { currentPage, totalPages, purchaseCars } =
      await purchaseCarsService.getBestSellerPurchaseCars(page, limit);

    const response = {
      currentPage,
      totalPages,
      purchaseCars: purchaseCars.map((car) => _.pick(car, purchaseCarSchema)),
    };

    res.status(httpStatus.OK).json(response);
  } catch (err) {
    next(err);
  }
};

module.exports.searchPurchaseCars = async (req, res, next) => {
  try {
    const {
      page,
      limit,
      searchTerm,
      minPrice,
      maxPrice,
      brands,
      colors,
      years,
    } = req.body;

    const { currentPage, totalPages, purchaseCars } =
      await purchaseCarsService.searchPurchaseCars(
        searchTerm,
        page,
        limit,
        minPrice,
        maxPrice,
        brands,
        colors,
        years
      );

    const response = {
      currentPage,
      totalPages,
      purchaseCars: purchaseCars.map((car) => _.pick(car, purchaseCarSchema)),
    };

    res.status(httpStatus.OK).json(response);
  } catch (err) {
    next(err);
  }
};

module.exports.getMyPurchaseCars = async (req, res, next) => {
  try {
    const user = req.user;
    const { page, limit } = req.query;

    const { currentPage, totalPages, purchaseCars } =
      await purchaseCarsService.getMyPurchaseCars(user, page, limit);

    const response = {
      currentPage,
      totalPages,
      purchaseCars: purchaseCars.map((car) => _.pick(car, purchaseCarSchema)),
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
      phoneICC,
      phoneNSN,
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
      phoneICC,
      phoneNSN,
      description,
      photo1,
      photo2,
      photo3,
      photo4,
      photo5,
      photo6
    );

    // Send notification to admins
    const notificationForAdmin = notifications.purchaseCars.postAddedForAdmin(
      car.photos[0],
      car._id
    );
    await usersService.sendNotificationToAdmins(notificationForAdmin);

    // Send notification to user
    const notificationForUser = notifications.purchaseCars.postAddedForUser(
      car.photos[0],
      car._id
    );
    await usersService.sendNotification([user._id], notificationForUser);

    const response = _.pick(car, purchaseCarSchema);

    res.status(httpStatus.OK).json(response);
  } catch (err) {
    next(err);
  }
};

module.exports.markPurchaseCarAsSold = async (req, res, next) => {
  try {
    const { carId: purchaseCarId } = req.body;

    const purchaseCar = await purchaseCarsService.markPurchaseCarAsSold(
      purchaseCarId
    );

    const response = _.pick(purchaseCar, purchaseCarSchema);

    res.status(httpStatus.OK).json(response);
  } catch (err) {
    next(err);
  }
};
