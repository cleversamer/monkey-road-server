const mongoose = require("mongoose");
const { check, validationResult } = require("express-validator");
const httpStatus = require("http-status");
const { ApiError } = require("../apiError");
const errors = require("../../config/errors");
const { server } = require("../../config/system");
const countries = require("../../data/countries.json");
const carsData = require("../../data/cars");
const {
  user: userValidation,
  rentCar: rentCarValidation,
  purchaseCar: purchaseCarValidation,
  brand: brandValidation,
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
  .trim()
  .isLength({
    min: userValidation.verificationCode.exactLength,
    max: userValidation.verificationCode.exactLength,
  })
  .isNumeric()
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

const checkPhone = (req, res, next) => {
  if (typeof req.body.phone !== "object") {
    const statusCode = httpStatus.BAD_REQUEST;
    const message = errors.auth.invalidPhone;
    const err = new ApiError(statusCode, message);
    return next(err);
  }

  let { icc, nsn } = req.body.phone;

  // Convert phone to string if it's not a string.
  icc = String(icc);
  nsn = String(nsn);

  // Check if icc starts with a plus `+`
  if (!icc.startsWith("+")) {
    req.body.phone.icc = `+${icc}`;
    icc = `+${icc}`;
  }

  // Check if phone's ICC is correct
  const iccExist = countries.list.find((c) => c.icc === icc);
  if (!iccExist) {
    const statusCode = httpStatus.BAD_REQUEST;
    const message = errors.auth.invalidICC;
    const err = new ApiError(statusCode, message);
    return next(err);
  }

  // Check if phone's NSN is in range
  if (nsn.length < countries.minNSN || nsn.length > countries.maxNSN) {
    const statusCode = httpStatus.BAD_REQUEST;
    const message = errors.auth.invalidPhone;
    const err = new ApiError(statusCode, message);
    return next(err);
  }

  // Check if phone's NSN contains only numbers
  for (let i = 0; i < nsn.length; i++) {
    const char = nsn.charCodeAt(i);

    if (char < 48 || char > 57) {
      const statusCode = httpStatus.BAD_REQUEST;
      const message = errors.auth.phoneNotOnlyNumbers;
      const err = new ApiError(statusCode, message);
      return next(err);
    }
  }

  next();
};

const checkMongoIdQueryParam = (req, res, next) => {
  const emptyQueryParams = !Object.keys(req.query).length;
  if (emptyQueryParams) {
    const statusCode = httpStatus.BAD_REQUEST;
    const message = errors.system.noMongoId;
    const err = new ApiError(statusCode, message);
    return next(err);
  }

  for (let item in req.query) {
    if (!mongoose.isValidObjectId(req.query[item])) {
      const statusCode = httpStatus.BAD_REQUEST;
      const message = errors.system.invalidMongoId;
      const err = new ApiError(statusCode, message);
      return next(err);
    }
  }

  next();
};

const checkMongoIdParam = (req, res, next) => {
  const emptyParams = !Object.keys(req.params).length;
  if (emptyParams) {
    const statusCode = httpStatus.BAD_REQUEST;
    const message = errors.system.noMongoId;
    const err = new ApiError(statusCode, message);
    return next(err);
  }

  for (let item in req.params) {
    if (!mongoose.isValidObjectId(req.params[item])) {
      const statusCode = httpStatus.BAD_REQUEST;
      const message = errors.system.invalidMongoId;
      const err = new ApiError(statusCode, message);
      return next(err);
    }
  }

  next();
};

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
  .isIn(carsData.COLORS.EN)
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

const checkPurchaseCarNoOfSeats = check("noOfSeats")
  .trim()
  .isNumeric()
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

module.exports = {
  next,
  putQueryParamsInBody,
  checkPhone,
  checkMongoIdQueryParam,
  conditionalCheck,
  checkFile,
  checkMongoIdParam,
  checkEmailOrPhone,
  checkEmail,
  checkPassword,
  checkOldPassword,
  checkNewPassword,
  checkCode,
  checkLanguage,
  checkName,
  checkRole,
  checkDeviceToken,
  checkSkip,
  checkRentCarName,
  checkRentCarModel,
  checkRentCarENColor,
  checkRentCarARColor,
  checkRentCarENBrand,
  checkRentCarARBrand,
  checkRentCarYear,
  checkRentCarDescription,
  checkSearchTerm,
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
  checkPurchaseCarNoOfSeats,
  checkPurchaseCarKiloPerHour,
  checkPurchaseCarPrice,
  checkPurchaseCarPhoneNumber,
  checkPurchaseCarDescription,
};
