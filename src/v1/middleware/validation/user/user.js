const commonMiddleware = require("../common");

const validateUpdateProfile = [
  commonMiddleware.checkLanguage,
  commonMiddleware.conditionalCheck("name", commonMiddleware.checkName),
  commonMiddleware.checkFile("avatar", ["png", "jpg", "jpeg"], false),
  commonMiddleware.conditionalCheck("email", commonMiddleware.checkEmail),
  commonMiddleware.conditionalCheck("phoneICC", commonMiddleware.checkPhoneICC),
  commonMiddleware.conditionalCheck("phoneNSN", commonMiddleware.checkPhoneNSN),
  commonMiddleware.next,
];

const validateUpdateUserProfile = [
  commonMiddleware.checkEmailOrPhone,
  ...validateUpdateProfile,
];

const validateUpdateUserRole = [
  commonMiddleware.checkEmailOrPhone,

  commonMiddleware.checkRole(true),

  commonMiddleware.next,
];

const validateVerifyUser = [
  commonMiddleware.checkEmailOrPhone,
  commonMiddleware.next,
];

const validateFindUserByEmailOrPhone = [
  commonMiddleware.putQueryParamsInBody,
  commonMiddleware.checkEmailOrPhone,
  commonMiddleware.next,
];

const addToFavoritesValidator = [
  commonMiddleware.checkPurchaseCarId,
  commonMiddleware.next,
];

const deleteFromFavoritesValidator = [
  commonMiddleware.checkPurchaseCarId,
  commonMiddleware.next,
];

module.exports = {
  validateUpdateProfile,
  validateUpdateUserProfile,
  validateUpdateUserRole,
  validateVerifyUser,
  validateFindUserByEmailOrPhone,
  addToFavoritesValidator,
  deleteFromFavoritesValidator,
};
