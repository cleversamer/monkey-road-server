const router = require("express").Router();
const { usersController } = require("../../controllers");
const { authValidator, userValidator } = require("../../middleware/validation");
const auth = require("../../middleware/auth");

//////////////////// User: Authentication ////////////////////
router.get("/isauth", auth("readOwn", "user", true), usersController.isAuth);

//////////////////// User: Varification ////////////////////
router
  .route("/verify/email")
  .get(
    authValidator.resendCodeValidator,
    auth("readOwn", "emailVerificationCode", true),
    usersController.resendEmailOrPhoneVerificationCode("email")
  )
  .post(
    authValidator.codeValidator,
    auth("updateOwn", "emailVerificationCode", true),
    usersController.verifyEmailOrPhone("email")
  );

router
  .route("/verify/phone")
  .get(
    authValidator.resendCodeValidator,
    auth("readOwn", "phoneVerificationCode", true),
    usersController.resendEmailOrPhoneVerificationCode("phone")
  )
  .post(
    authValidator.codeValidator,
    auth("updateOwn", "phoneVerificationCode", true),
    usersController.verifyEmailOrPhone("phone")
  );

//////////////////// User: Password ////////////////////
router
  .route("/password/forgot")
  .get(
    authValidator.getForgotPasswordCode,
    usersController.sendForgotPasswordCode
  )
  .post(
    authValidator.forgotPasswordValidator,
    usersController.handleForgotPassword
  );

router.patch(
  "/password/change",
  authValidator.changePasswordValidator,
  auth("updateOwn", "password"),
  usersController.changePassword
);

//////////////////// User: Profile ////////////////////
router.patch(
  "/profile/update",
  userValidator.validateUpdateProfile,
  auth("updateOwn", "user"),
  usersController.updateProfile
);

//////////////////// User: Notifications ////////////////////
router.get(
  "/notifications/see",
  auth("readOwn", "notification", true),
  usersController.seeNotifications
);

router.delete(
  "/notifications/clear",
  auth("deleteOwn", "notification"),
  usersController.clearNotifications
);

//////////////////// User: Favorites ////////////////////
router.post(
  "/favorites/add",
  userValidator.addToFavoritesValidator,
  auth("createOwn", "favorites"),
  usersController.addToFavorites
);

router.get(
  "/favorites/my",
  auth("readOwn", "favorites"),
  usersController.getMyFavorites
);

router.delete(
  "/favorites/delete",
  userValidator.deleteFromFavoritesValidator,
  auth("deleteOwn", "favorites"),
  usersController.deleteFromFavorites
);

//////////////////// Admin: Profile ////////////////////
router.patch(
  "/admin/profile/update",
  userValidator.validateUpdateUserProfile,
  auth("updateAny", "user"),
  usersController.updateUserProfile
);

//////////////////// Admin: Role ////////////////////
router.patch(
  "/admin/profile/update-role",
  userValidator.validateUpdateUserRole,
  auth("updateAny", "user"),
  usersController.changeUserRole
);

router.get(
  "/admin/profile/find",
  userValidator.validateFindUserByEmailOrPhone,
  auth("readAny", "user"),
  usersController.findUserByEmailOrPhone
);

//////////////////// Admin: Verification ////////////////////
router.patch(
  "/admin/profile/verify",
  userValidator.validateVerifyUser,
  auth("updateAny", "user"),
  usersController.verifyUser
);

//////////////////// Admin: Notifications ////////////////////
router.post(
  "/admin/notification/send",
  userValidator.sendNotificationValidator,
  auth("createAny", "notification"),
  usersController.sendNotification
);

//////////////////// Admin: Cars ////////////////////
router.get(
  "/admin/cars/status",
  auth("readAny", "car"),
  usersController.getCarsStatus
);

//////////////////// Admin: Excel ////////////////////
router.get(
  "/export",
  auth("readAny", "user"),
  usersController.exportUsersToExcel
);

//////////////////// Admin: Balance ////////////////////
router.post(
  "/admin/office/:userId/deliver-payment",
  userValidator.deliverPaymentToOfficeValidator,
  auth("updateAny", "user"),
  usersController.deliverPaymentToOffice
);

module.exports = router;
