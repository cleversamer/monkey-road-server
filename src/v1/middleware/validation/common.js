const mongoose = require("mongoose");
const { SUPPORTED_ROLES } = require("../../models/user/user.model");
const { check, validationResult } = require("express-validator");
const httpStatus = require("http-status");
const { ApiError } = require("../apiError");
const errors = require("../../config/errors");
const { server } = require("../../config/system");
const countries = require("../../data/countries.json");
const { user: validation } = require("../../middleware/validation/models");

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
  .isLength({
    min: validation.deviceToken.minLength,
    max: validation.deviceToken.maxLength,
  })
  .withMessage(errors.auth.invalidDeviceToken);

const checkEmailOrPhone = check("emailOrPhone")
  .isLength({
    min: Math.min(validation.email.minLength, countries.minPhone),
    max: Math.max(validation.email.maxLength, countries.maxPhone),
  })
  .withMessage(errors.auth.invalidEmailOrPhone)
  .bail();

const checkEmail = check("email")
  .isEmail()
  .isLength({
    min: validation.email.minLength,
    max: validation.email.maxLength,
  })
  .withMessage(errors.auth.invalidEmail)
  .bail();

const checkPassword = check("password")
  .isLength({
    min: validation.password.minLength,
    max: validation.password.maxLength,
  })
  .withMessage(errors.auth.invalidPassword);

const checkOldPassword = check("oldPassword")
  .isLength({
    min: validation.password.minLength,
    max: validation.password.maxLength,
  })
  .withMessage(errors.auth.invalidPassword);

const checkNewPassword = check("newPassword")
  .isLength({
    min: validation.password.minLength,
    max: validation.password.maxLength,
  })
  .withMessage(errors.auth.invalidPassword);

const checkCode = check("code")
  .isLength({
    min: validation.verificationCode.exactLength,
    max: validation.verificationCode.exactLength,
  })
  .isNumeric()
  .withMessage(errors.auth.invalidCode);

const checkLanguage = check("lang")
  .notEmpty()
  .withMessage(errors.user.noLanguage)
  .isIn(server.SUPPORTED_LANGUAGES)
  .withMessage(errors.user.unsupportedLanguage);

const checkName = check("name")
  .isLength({
    min: validation.name.minLength,
    max: validation.name.maxLength,
  })
  .withMessage(errors.auth.invalidName);

const checkRole = (exceptAdmin = false) =>
  exceptAdmin
    ? check("role")
        .isIn(SUPPORTED_ROLES.filter((role) => role !== "admin"))
        .withMessage(errors.user.invalidRole)
    : check("role").isIn(SUPPORTED_ROLES).withMessage(errors.user.invalidRole);

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
    const message = errors.data.noMongoId;
    const err = new ApiError(statusCode, message);
    return next(err);
  }

  for (let item in req.query) {
    if (!mongoose.isValidObjectId(req.query[item])) {
      const statusCode = httpStatus.BAD_REQUEST;
      const message = errors.data.invalidMongoId;
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
    const message = errors.data.noMongoId;
    const err = new ApiError(statusCode, message);
    return next(err);
  }

  for (let item in req.params) {
    if (!mongoose.isValidObjectId(req.params[item])) {
      const statusCode = httpStatus.BAD_REQUEST;
      const message = errors.data.invalidMongoId;
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

module.exports = {
  next,
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
};
