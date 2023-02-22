const {
  CLIENT_SCHEMA: rentCarSchema,
} = require("../../models/car/rentCar.model");
const {
  CLIENT_SCHEMA: orderSchema,
} = require("../../models/car/rentOrder.model");
const { rentCarsService, usersService } = require("../../services");
const httpStatus = require("http-status");
const _ = require("lodash");
const { notifications } = require("../../config");

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
    const { searchTerm, skip, minPrice, maxPrice, brands, colors, years } =
      req.body;

    const cars = await rentCarsService.searchRentCars(
      searchTerm,
      skip,
      minPrice,
      maxPrice,
      brands,
      colors,
      years
    );

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
      phoneICC,
      phoneNSN,
    } = req.body;

    const { order, rentCar } = await rentCarsService.requestCarRental(
      user,
      rentCarId,
      startDate,
      noOfDays,
      locationTitle,
      longitude,
      latitude,
      fullName,
      phoneICC,
      phoneNSN
    );

    // Send notification to admin
    const notificationForAdmin = notifications.rentCars.rentalRequestForAdmin(
      rentCar.photos[0]
    );
    await usersService.sendNotificationToAdmins(notificationForAdmin);

    // Send notification to office
    const notificationForOffice = notifications.rentCars.rentalRequestForOffice(
      rentCar.photos[0]
    );
    await usersService.sendNotification([order.office], notificationForOffice);

    // Send notification to user
    const notificationForUser = notifications.rentCars.rentalRequestForUser(
      rentCar.photos[0]
    );
    await usersService.sendNotification([order.author], notificationForUser);

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

    // Send notification to admins
    const notificationForAdmin = notifications.rentCars.postAddedForAdmin(
      rentCar.photos[0]
    );
    await usersService.sendNotificationToAdmins(notificationForAdmin);

    // Send notification to office
    const notificationForOffice = notifications.rentCars.postAddedForOffice(
      rentCar.photos[0]
    );
    await usersService.sendNotification([user._id], notificationForOffice);

    const response = _.pick(rentCar, rentCarSchema);

    res.status(httpStatus.OK).json(response);
  } catch (err) {
    next(err);
  }
};

module.exports.archiveRentCar = async (req, res, next) => {
  try {
    const { carId: rentCarId } = req.params;

    const archivedCar = await rentCarsService.archiveRentCar(rentCarId);

    const response = _.pick(archivedCar, rentCarSchema);

    res.status(httpStatus.OK).json(response);
  } catch (err) {
    next(err);
  }
};

module.exports.restoreRentCar = async (req, res, next) => {
  try {
    const { carId: rentCarId } = req.params;

    const restoredCar = await rentCarsService.restoreRentCar(rentCarId);

    const response = _.pick(restoredCar, rentCarSchema);

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

    // Mark rent car as accepted
    const car = await rentCarsService.acceptRentCar(carId);

    // Send notification to admins
    const notificationForAdmin = notifications.rentCars.postAcceptedForAdmin(
      car.photos[0]
    );
    await usersService.sendNotificationToAdmins(notificationForAdmin);

    // Send notification to office
    const notificationForOffice = notifications.rentCars.postAcceptedForOffice(
      car.photos[0]
    );
    await usersService.sendNotification(
      [car.office.ref],
      notificationForOffice
    );

    const response = _.pick(car, rentCarSchema);

    res.status(httpStatus.OK).json(response);
  } catch (err) {
    next(err);
  }
};

module.exports.rejectRentCar = async (req, res, next) => {
  try {
    const { carId } = req.params;
    const { rejectionReason } = req.body;

    // Remove car
    const car = await rentCarsService.rejectRentCar(carId);

    // Send notification to admin
    const notificationForAdmin = notifications.rentCars.postRejectedForAdmin(
      rejectionReason,
      car.photos[0]
    );
    await usersService.sendNotificationToAdmins(notificationForAdmin);

    // Send notification to office
    const notificationForOffice = notifications.rentCars.postRejectedForOffice(
      rejectionReason,
      car.photos[0]
    );
    await usersService.sendNotification(
      [car.office.ref],
      notificationForOffice
    );

    // Create response
    const response = _.pick(car, rentCarSchema);

    res.status(httpStatus.OK).json(response);
  } catch (err) {
    next(err);
  }
};
