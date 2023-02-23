const commonMiddleware = require("../common");

const validateUpdateProfile = [
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

const sendNotificationValidator = [
  commonMiddleware.checkUserIds,
  commonMiddleware.checkNotificationTitleEN,
  commonMiddleware.checkNotificationTitleAR,
  commonMiddleware.checkNotificationBodyEN,
  commonMiddleware.checkNotificationBodyAR,
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
  commonMiddleware.putQueryParamsInBody,
  commonMiddleware.checkPurchaseCarId,
  commonMiddleware.next,
];

const deliverPaymentToOfficeValidator = [
  commonMiddleware.putQueryParamsInBody,
  commonMiddleware.checkUserId,
  commonMiddleware.checkPaymentDeliveryAmount,
  commonMiddleware.next,
];

module.exports = {
  validateUpdateProfile,
  validateUpdateUserProfile,
  validateUpdateUserRole,
  validateVerifyUser,
  sendNotificationValidator,
  validateFindUserByEmailOrPhone,
  addToFavoritesValidator,
  deleteFromFavoritesValidator,
  deliverPaymentToOfficeValidator,
};
