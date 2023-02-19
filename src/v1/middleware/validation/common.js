const { check, validationResult } = require("express-validator");
const httpStatus = require("http-status");
const { ApiError } = require("../apiError");
const errors = require("../../config/errors");
const { server } = require("../../config/system");
const countries = require("../../data/countries.json");
const carsData = require("../../data/cars");
const {
  isValidObjectId,
  Types: { ObjectId },
} = require("mongoose");
const {
  user: userValidation,
  rentCar: rentCarValidation,
  purchaseCar: purchaseCarValidation,
  brand: brandValidation,
  rentOrder: rentOrderValidation,
} = require("../../config/models");

const putQueryParamsInBody = (req, res, next) => {
  req.body = {
    ...req.body,
    ...req.query,
  };

  next();
};

const next = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const statusCode = httpStatus.BAD_REQUEST;
    const message = errors.array()[0].msg;
    const err = new ApiError(statusCode, message);
    return next(err);
  }

  next();
};

const checkDeviceToken = check("deviceToken")
  .trim()
  .isLength({
    min: userValidation.deviceToken.minLength,
    max: userValidation.deviceToken.maxLength,
  })
  .withMessage(errors.auth.invalidDeviceToken);

const checkEmailOrPhone = check("emailOrPhone")
  .trim()
  .isLength({
    min: Math.min(userValidation.email.minLength, countries.minPhone),
    max: Math.max(userValidation.email.maxLength, countries.maxPhone),
  })
  .withMessage(errors.auth.invalidEmailOrPhone)
  .bail();

const checkEmail = check("email")
  .trim()
  .isEmail()
  .isLength({
    min: userValidation.email.minLength,
    max: userValidation.email.maxLength,
  })
  .withMessage(errors.auth.invalidEmail)
  .bail();

const checkAuthType = check("authType")
  .trim()
  .isIn(userValidation.authTypes)
  .withMessage(errors.user.invalidAuthType);

const checkPassword = check("password")
  .trim()
  .isLength({
    min: userValidation.password.minLength,
    max: userValidation.password.maxLength,
  })
  .withMessage(errors.auth.invalidPassword);

const checkOldPassword = check("oldPassword")
  .trim()
  .isLength({
    min: userValidation.password.minLength,
    max: userValidation.password.maxLength,
  })
  .withMessage(errors.auth.invalidPassword);

const checkNewPassword = check("newPassword")
  .trim()
  .isLength({
    min: userValidation.password.minLength,
    max: userValidation.password.maxLength,
  })
  .withMessage(errors.auth.invalidPassword);

const checkCode = check("code")
  .isLength({
    min: userValidation.verificationCode.exactLength,
    max: userValidation.verificationCode.exactLength,
  })
  .withMessage(errors.auth.invalidCode);

const checkLanguage = check("lang")
  .trim()
  .notEmpty()
  .withMessage(errors.user.noLanguage)
  .isIn(server.SUPPORTED_LANGUAGES)
  .withMessage(errors.user.unsupportedLanguage);

const checkName = check("name")
  .trim()
  .isLength({
    min: userValidation.name.minLength,
    max: userValidation.name.maxLength,
  })
  .withMessage(errors.auth.invalidName);

const checkRole = (exceptAdmin = false) =>
  exceptAdmin
    ? check("role")
        .trim()
        .isIn(userValidation.roles.filter((role) => role !== "admin"))
        .withMessage(errors.user.invalidRole)
    : check("role")
        .trim()
        .isIn(userValidation.roles)
        .withMessage(errors.user.invalidRole);

const checkRegisterRole = check("role")
  .trim()
  .isIn(userValidation.registerRoles)
  .withMessage(errors.user.invalidRole);

const checkPhoneICC = check("phoneICC")
  .isIn(countries.list.map((c) => c.icc))
  .withMessage(errors.auth.invalidICC);

const checkPhoneNSN = check("phoneNSN")
  .isLength({
    min: countries.minNSN,
    max: countries.maxNSN,
  })
  .withMessage(errors.auth.invalidPhone);

const conditionalCheck = (key, checker) => (req, res, next) =>
  req.body[key] ? checker(req, res, next) : next();

const checkFile =
  (key, supportedTypes, compulsory = true) =>
  (req, res, next) => {
    if (!compulsory && (!req.files || !req.files[key])) {
      return next();
    }

    if (compulsory && (!req.files || !req.files[key])) {
      const statusCode = httpStatus.BAD_REQUEST;
      const message = errors.system.noPhoto;
      const err = new ApiError(statusCode, message);
      return next(err);
    }

    const fileType = req.files[key].name.split(".")[1];
    if (!supportedTypes.includes(fileType)) {
      const statusCode = httpStatus.BAD_REQUEST;
      const message = errors.system.invalidExtension;
      const err = new ApiError(statusCode, message);
      return next(err);
    }

    next();
  };

const checkSkip = check("skip")
  .trim()
  .isNumeric()
  .withMessage(errors.system.invalidSkip);

const checkCarId = check("carId")
  .isMongoId()
  .withMessage(errors.system.invalidCarId);

const checkOrderId = check("orderId")
  .isMongoId()
  .withMessage(errors.system.invalidOrderId);

const checkRejectionReason = check("rejectionReason")
  .isLength({
    min: rentOrderValidation.reasonForRejection.minLength,
    max: rentOrderValidation.reasonForRejection.maxLength,
  })
  .withMessage(errors.rentOrder.invalidRejectionReason);

const checkRentCarName = check("carName")
  .trim()
  .isLength({
    min: rentCarValidation.name.minLength,
    max: rentCarValidation.name.maxLength,
  })
  .withMessage(errors.rentCar.invalidName);

const checkRentCarModel = check("model")
  .trim()
  .isLength({
    min: rentCarValidation.model.minLength,
    max: rentCarValidation.model.maxLength,
  })
  .withMessage(errors.rentCar.invalidModel);

const checkRentCarENColor = check("colorEN")
  .trim()
  .isIn(carsData.COLORS.EN)
  .withMessage(errors.rentCar.invalidENColor);

const checkRentCarARColor = check("colorAR")
  .isIn(carsData.COLORS.AR)
  .withMessage(errors.rentCar.invalidARColor);

const checkRentCarENBrand = check("brandEN")
  .trim()
  .isLength({
    min: brandValidation.name.minLength,
    max: brandValidation.name.maxLength,
  })
  .withMessage(errors.rentCar.invalidENBrand);

const checkRentCarARBrand = check("brandEN")
  .trim()
  .isLength({
    min: brandValidation.name.minLength,
    max: brandValidation.name.maxLength,
  })
  .withMessage(errors.rentCar.invalidARBrand);

const checkRentCarYear = check("year")
  .trim()
  .isIn(carsData.YEARS)
  .withMessage(errors.rentCar.invalidYear);

const checkRentCarDailyPrice = check("dailyPrice")
  .isInt({
    min: rentCarValidation.price.daily.min,
    max: rentCarValidation.price.daily.max,
  })
  .withMessage(errors.rentCar.invalidDailyPrice);

const checkRentCarWeeklyPrice = check("weeklyPrice")
  .isInt({
    min: rentCarValidation.price.weekly.min,
    max: rentCarValidation.price.weekly.max,
  })
  .withMessage(errors.rentCar.invalidWeeklyPrice);

const checkRentCarMonthlyPrice = check("monthlyPrice")
  .isInt({
    min: rentCarValidation.price.monthly.min,
    max: rentCarValidation.price.monthly.max,
  })
  .withMessage(errors.rentCar.invalidMonthlyPrice);

const checkRentCarDeposit = check("deposit")
  .isInt({
    min: rentCarValidation.price.deposit.min,
    max: rentCarValidation.price.deposit.max,
  })
  .withMessage(errors.rentCar.invalidDeposit);

const checkRentCarDescription = check("description")
  .trim()
  .isLength({
    min: rentCarValidation.description.minLength,
    max: rentCarValidation.description.maxLength,
  })
  .withMessage(errors.rentCar.invalidDescription);

const checkSearchTerm = check("searchTerm")
  .trim()
  .isLength({
    min: rentCarValidation.searchTerm.minLength,
    max: rentCarValidation.searchTerm.maxLength,
  })
  .withMessage(errors.rentCar.invalidSearchTerm);

const checkRentCarSearchMinPrice = check("minPrice")
  .isNumeric()
  .withMessage(errors.rentCar.invalidPrice);

const checkRentCarSearchMaxPrice = check("maxPrice")
  .isNumeric()
  .withMessage(errors.rentCar.invalidPrice);

const checkSearchBrandsList = (req, res, next) => {
  let { brands } = req.body;

  if (!brands) {
    return next();
  }

  const searchBrands = brands
    .split(",")
    .map((b) => {
      try {
        b = new ObjectId(b.trim());
        return true;
      } catch (err) {
        return false;
      }
    })
    .filter((b) => isValidObjectId(b));

  req.body.brands = searchBrands;
  next();
};

const checkSearchColors = (req, res, next) => {
  let { colors } = req.body;

  if (!colors) {
    return next();
  }

  const searchColors = colors
    .split(",")
    .map((c) => c.trim())
    .filter((c) => carsData.COLORS.EN.includes(c));

  req.body.colors = searchColors;
  next();
};

const checkSearchYears = (req, res, next) => {
  let { years } = req.body;

  if (!years) {
    return next();
  }

  const searchYears = years
    .split(",")
    .map((y) => y.trim())
    .filter((y) => carsData.YEARS.includes(y));

  req.body.years = searchYears;
  next();
};

const checkPurchaseCarId = check("purchaseCarId")
  .isMongoId()
  .withMessage(errors.purchaseCar.invalidId);

const checkPurchaseCarName = check("carName")
  .trim()
  .isLength({
    min: purchaseCarValidation.name.minLength,
    max: purchaseCarValidation.name.maxLength,
  })
  .withMessage(errors.purchaseCar.invalidName);

const checkPurchaseCarVIN = check("vin")
  .trim()
  .isLength({
    min: purchaseCarValidation.vin.exactLength,
    max: purchaseCarValidation.vin.exactLength,
  })
  .withMessage(errors.purchaseCar.invalidVIN);

const checkPurchaseCarModel = check("model")
  .trim()
  .isLength({
    min: purchaseCarValidation.model.minLength,
    max: purchaseCarValidation.model.maxLength,
  })
  .withMessage(errors.purchaseCar.invalidModel);

const checkBrand = check("brandId")
  .trim()
  .isMongoId()
  .withMessage(errors.brand.invalidId);

const checkPurchaseCarYear = check("year")
  .trim()
  .isIn(carsData.YEARS)
  .withMessage(errors.purchaseCar.invalidYear);

const checkPurchaseCarENColor = check("colorEN")
  .trim()
  .isIn(carsData.COLORS.EN)
  .withMessage(errors.purchaseCar.invalidENColor);

const checkPurchaseCarARColor = check("colorAR")
  .trim()
  .isIn(carsData.COLORS.AR)
  .withMessage(errors.purchaseCar.invalidARColor);

const checkPurchaseCarTrimeLevel = check("trimLevel")
  .trim()
  .isIn(carsData.TRIM_LEVELS)
  .withMessage(errors.purchaseCar.invalidTrimLevel);

const checkPurchaseCarENVehicleType = check("vehicleTypeEN")
  .trim()
  .isIn(carsData.VEHICLE_TYPES.EN)
  .withMessage(errors.purchaseCar.invalidENVehicleType);

const checkPurchaseCarARVehicleType = check("vehicleTypeAR")
  .trim()
  .isIn(carsData.VEHICLE_TYPES.AR)
  .withMessage(errors.purchaseCar.invalidARVehicleType);

const checkPurchaseCarENFuelType = check("fuelTypeEN")
  .trim()
  .isIn(carsData.FUEL_TYPES.EN)
  .withMessage(errors.purchaseCar.invalidENFuelType);

const checkPurchaseCarARFuelType = check("fuelTypeAR")
  .trim()
  .isIn(carsData.FUEL_TYPES.AR)
  .withMessage(errors.purchaseCar.invalidARFuelType);

const checkPurchaseCarNoOfSeats = check("noOfSeats")
  .trim()
  .isIn(carsData.SEATS_NUMBER)
  .withMessage(errors.purchaseCar.invalidNoOfSeats);

const checkPurchaseCarKiloPerHour = check("kiloPerHour")
  .isInt({
    min: purchaseCarValidation.kiloPerHour.min,
    max: purchaseCarValidation.kiloPerHour.max,
  })
  .withMessage(errors.purchaseCar.invalidKiloPerHour);

const checkPurchaseCarPrice = check("price")
  .isInt({
    min: purchaseCarValidation.price.min,
    max: purchaseCarValidation.price.max,
  })
  .withMessage(errors.purchaseCar.invalidPrice);

const checkPurchaseCarPhoneNumber = check("phoneNumber")
  .trim()
  .isLength({
    min: purchaseCarValidation.phoneNumber.minLength,
    max: purchaseCarValidation.phoneNumber.maxLength,
  })
  .withMessage(errors.purchaseCar.invalidPhoneNumber);

const checkPurchaseCarDescription = check("description")
  .trim()
  .isLength({
    min: purchaseCarValidation.description.minLength,
    max: purchaseCarValidation.description.maxLength,
  })
  .withMessage(errors.purchaseCar.invalidDescription);

const checkBrandENName = check("nameEN")
  .trim()
  .isLength({
    min: brandValidation.name.minLength,
    max: brandValidation.name.maxLength,
  })
  .withMessage(errors.brand.invalidName);

const checkBrandARName = check("nameAR")
  .trim()
  .isLength({
    min: brandValidation.name.minLength,
    max: brandValidation.name.maxLength,
  })
  .withMessage(errors.brand.invalidName);

const checkNoOfDays = check("noOfDays")
  .isInt({
    min: rentOrderValidation.noOfDays.min,
    max: rentOrderValidation.noOfDays.max,
  })
  .withMessage(errors.rentOrder.invalidNoOfDays);

const checkLocationTitle = check("locationTitle")
  .isLength({
    min: rentOrderValidation.locationTitle.minLength,
    max: rentOrderValidation.locationTitle.maxLength,
  })
  .withMessage(errors.rentOrder.invalidLocationTitle);

const checkFullName = check("fullName")
  .isLength({
    min: rentOrderValidation.fullName.minLength,
    max: rentOrderValidation.fullName.maxLength,
  })
  .withMessage(errors.rentOrder.invalidFullName);

module.exports = {
  next,
  putQueryParamsInBody,
  conditionalCheck,
  checkFile,
  checkEmailOrPhone,
  checkEmail,
  checkAuthType,
  checkPassword,
  checkOldPassword,
  checkNewPassword,
  checkCode,
  checkLanguage,
  checkName,
  checkRole,
  checkRegisterRole,
  checkPhoneICC,
  checkPhoneNSN,
  checkDeviceToken,
  checkSkip,
  checkCarId,
  checkOrderId,
  checkRejectionReason,
  checkRentCarName,
  checkRentCarModel,
  checkRentCarENColor,
  checkRentCarARColor,
  checkRentCarENBrand,
  checkRentCarARBrand,
  checkRentCarYear,
  checkRentCarDescription,
  checkSearchTerm,
  checkRentCarSearchMinPrice,
  checkRentCarSearchMaxPrice,
  checkSearchBrandsList,
  checkSearchColors,
  checkSearchYears,
  checkPurchaseCarId,
  checkPurchaseCarName,
  checkPurchaseCarVIN,
  checkPurchaseCarModel,
  checkBrand,
  checkPurchaseCarYear,
  checkPurchaseCarENColor,
  checkPurchaseCarARColor,
  checkPurchaseCarTrimeLevel,
  checkPurchaseCarENVehicleType,
  checkPurchaseCarARVehicleType,
  checkPurchaseCarENFuelType,
  checkPurchaseCarARFuelType,
  checkPurchaseCarNoOfSeats,
  checkPurchaseCarKiloPerHour,
  checkPurchaseCarPrice,
  checkPurchaseCarPhoneNumber,
  checkPurchaseCarDescription,
  checkRentCarDailyPrice,
  checkRentCarWeeklyPrice,
  checkRentCarMonthlyPrice,
  checkRentCarDeposit,
  checkBrandENName,
  checkBrandARName,
  checkNoOfDays,
  checkLocationTitle,
  checkFullName,
};
