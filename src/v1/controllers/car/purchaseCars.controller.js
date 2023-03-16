const {
  CLIENT_SCHEMA: purchaseCarSchema,
} = require("../../models/car/purchaseCar.model");
const {
  purchaseCarsService,
  usersService,
  fatoraService,
} = require("../../services");
const httpStatus = require("http-status");
const _ = require("lodash");
const { errors, success } = require("../../config");
const { ApiError } = require("../../middleware/apiError");
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

    // TODO: fetch purchase car post price
    const purchaseCarPostPrice = 100;

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

    const handleSuccess = async (body) => {
      try {
        const checkoutURL = body.result.checkout_url;
        car.invoiceURL = checkoutURL;
        await car.save();

        const response = {
          type: "txt/url",
          path: checkoutURL,
          carId: car._id,
        };

        res.status(httpStatus.OK).json(response);
      } catch (err) {
        next(err);
      }
    };

    const handleFailure = async (error) => {
      try {
        await purchaseCarsService.deletePurchaseCar(car._id);

        const statusCode = httpStatus.INTERNAL_SERVER_ERROR;
        const message = errors.fatora.somethingWrong;
        throw new ApiError(statusCode, message);
      } catch (err) {
        next(err);
      }
    };

    fatoraService.addFatoraTransaction(
      user,
      purchaseCarPostPrice,
      car._id,
      handleSuccess,
      handleFailure
    );
  } catch (err) {
    next(err);
  }
};

module.exports.payPurchaseCarPostCost = async (req, res, next) => {
  try {
    const user = req.user;
    const { carId: purchaseCarId } = req.params;

    const purchaseCar = await purchaseCarsService.findPurchaseCarById(
      purchaseCarId
    );

    const handleSuccess = async (body) => {
      try {
        const paymentStatus = body.result.payment_status;
        const bankTransactionId = body.result.transaction_id;

        purchaseCar.bankTransactionId = bankTransactionId;
        await purchaseCar.save();

        if (paymentStatus !== "SUCCESS") {
          const statusCode = httpStatus.FORBIDDEN;
          const message = errors.fatora.notPaid;
          const error = new ApiError(statusCode, message);
          return next(error);
        }

        purchaseCar.markAsPaid();
        await purchaseCar.save();

        // Send notification to admins
        const notificationForAdmin =
          notifications.purchaseCars.postAddedForAdmin(
            purchaseCar.photos[0],
            purchaseCar._id
          );
        await usersService.sendNotificationToAdmins(notificationForAdmin);

        // Send notification to user
        const notificationForUser = notifications.purchaseCars.postAddedForUser(
          purchaseCar.photos[0],
          purchaseCar._id
        );
        await usersService.sendNotification([user._id], notificationForUser);

        const response = success.purchaseCar.postCostPaid;

        res.status(httpStatus.OK).json(response);
      } catch (err) {
        next(err);
      }
    };

    const handleFailure = async (error) => {
      try {
        const statusCode = httpStatus.INTERNAL_SERVER_ERROR;
        const message = errors.fatora.somethingWrong;
        throw new ApiError(statusCode, message);
      } catch (err) {
        next(err);
      }
    };

    fatoraService.verifyFatoraTransaction(
      purchaseCar._id,
      purchaseCar.bankTransactionId,
      handleSuccess,
      handleFailure
    );
  } catch (err) {
    next(err);
  }
};

module.exports.markPurchaseCarAsSold = async (req, res, next) => {
  try {
    const { carId } = req.params;

    const purchaseCar = await purchaseCarsService.markPurchaseCarAsSold(carId);

    const response = _.pick(purchaseCar, purchaseCarSchema);

    res.status(httpStatus.OK).json(response);
  } catch (err) {
    next(err);
  }
};
