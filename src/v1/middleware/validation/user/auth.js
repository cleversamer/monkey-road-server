const { check } = require("express-validator");
const errors = require("../../../config/errors");
const commonMiddleware = require("../common");

const loginWithEmailValidator = [
  commonMiddleware.checkEmailOrPhone,
  commonMiddleware.checkPassword,
  commonMiddleware.conditionalCheck(
    "deviceToken",
    commonMiddleware.checkDeviceToken
  ),
  commonMiddleware.next,
];

const loginWithGoogleValidator = [
  commonMiddleware.conditionalCheck(
    "deviceToken",
    commonMiddleware.checkDeviceToken
  ),
  commonMiddleware.next,
];

const registerWithEmailValidator = [
  commonMiddleware.checkLanguage,
  commonMiddleware.checkName,
  commonMiddleware.checkEmail,
  commonMiddleware.checkPhoneICC,
  commonMiddleware.checkPhoneNSN,
  commonMiddleware.checkPassword,
  commonMiddleware.conditionalCheck(
    "deviceToken",
    commonMiddleware.checkDeviceToken
  ),
  commonMiddleware.next,
];

const registerWithGoogleValidator = [
  commonMiddleware.checkPhoneICC,
  commonMiddleware.checkPhoneNSN,
  commonMiddleware.conditionalCheck(
    "deviceToken",
    commonMiddleware.checkDeviceToken
  ),
  commonMiddleware.next,
];

const changePasswordValidator = [
  commonMiddleware.checkOldPassword,
  commonMiddleware.checkNewPassword,
  commonMiddleware.next,
];

const forgotPasswordValidator = [
  commonMiddleware.checkEmailOrPhone,
  commonMiddleware.checkNewPassword,
  commonMiddleware.checkCode,
  commonMiddleware.next,
];

const getForgotPasswordCode = [
  (req, res, next) => {
    req.query.emailOrPhone = req.query?.emailOrPhone?.toLowerCase();
    req.query.lang = req.query?.lang?.toLowerCase();
    req.query.sendTo = req.query?.sendTo?.toLowerCase();

    req.body.emailOrPhone = req.query.emailOrPhone;
    req.body.lang = req.query.lang;
    req.body.sendTo = req.query.sendTo;

    next();
  },

  commonMiddleware.checkEmailOrPhone,

  commonMiddleware.checkLanguage,

  check("sendTo")
    .isIn(["email", "phone"])
    .withMessage(errors.user.unsupportedReceiverType),

  commonMiddleware.next,
];

const emailValidator = [commonMiddleware.checkEmail, commonMiddleware.next];

const codeValidator = [commonMiddleware.checkCode, commonMiddleware.next];

const resendCodeValidator = [
  commonMiddleware.putQueryParamsInBody,
  commonMiddleware.checkLanguage,
  commonMiddleware.next,
];

module.exports = {
  loginWithEmailValidator,
  loginWithGoogleValidator,
  registerWithEmailValidator,
  registerWithGoogleValidator,
  changePasswordValidator,
  forgotPasswordValidator,
  emailValidator,
  getForgotPasswordCode,
  codeValidator,
  resendCodeValidator,
};
