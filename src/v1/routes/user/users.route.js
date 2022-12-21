const router = require("express").Router();
const { usersController } = require("../../controllers");
const { authValidator, userValidator } = require("../../middleware/validation");
const auth = require("../../middleware/auth");

//////////////////// User: Authentication ////////////////////
router.get("/isauth", auth("readOwn", "user", true), usersController.isAuth);

//////////////////// User: Varification ////////////////////
router
  .route("/verify-email")
  .get(
    auth("readOwn", "emailVerificationCode", true),
    authValidator.resendCodeValidator,
    usersController.resendEmailOrPhoneVerificationCode("email")
  )
  .post(
    auth("updateOwn", "emailVerificationCode", true),
    authValidator.codeValidator,
    usersController.verifyEmailOrPhone("email")
  );

router
  .route("/verify-phone")
  .get(
    auth("readOwn", "phoneVerificationCode", true),
    authValidator.resendCodeValidator,
    usersController.resendEmailOrPhoneVerificationCode("phone")
  )
  .post(
    auth("updateOwn", "phoneVerificationCode", true),
    authValidator.codeValidator,
    usersController.verifyEmailOrPhone("phone")
  );

//////////////////// User: Password ////////////////////
router
  .route("/forgot-password")
  .get(
    authValidator.getForgotPasswordCode,
    usersController.sendForgotPasswordCode
  )
  .post(
    authValidator.forgotPasswordValidator,
    usersController.handleForgotPassword
  );

router.patch(
  "/change-password",
  auth("updateOwn", "password"),
  authValidator.changePasswordValidator,
  usersController.changePassword
);

//////////////////// User: Profile ////////////////////
router.patch(
  "/update",
  auth("updateOwn", "user"),
  userValidator.validateUpdateProfile,
  usersController.updateProfile
);

//////////////////// User: Notifications ////////////////////
router.get(
  "/see-notifications",
  auth("readOwn", "notification"),
  usersController.seeNotifications
);

router.delete(
  "/clear-notifications",
  auth("deleteOwn", "notification"),
  usersController.clearNotifications
);

//////////////////// User: Payment Cards ////////////////////
// TODO:
// router.post(
//   "/add-payment-card",
//   auth("createOwn", "paymentCard"),
//   usersController.addPaymentCard
// );

// TODO:
// router.post(
//   "/update-payment-card",
//   auth("updateOwn", "paymentCard"),
//   usersController.updatePaymentCard
// );

// TODO:
// router.post(
//   "/delete-payment-card",
//   auth("deleteOwn", "paymentCard"),
//   usersController.deletePaymentCard
// );

//////////////////// User: Favorites ////////////////////
// TODO:
// router.get(
//   "/my-favorites",
//   auth("readOwn", "favorites"),
//   usersController.addToFavorites
// );

// TODO:
// router.delete(
//   "/delete-favorite",
//   auth("deleteOwn", "favorites"),
//   usersController.deleteFromFavorites
// );

//////////////////// Admin: Profile ////////////////////
router.patch(
  "/admin/update-profile",
  auth("updateAny", "user"),
  userValidator.validateUpdateUserProfile,
  usersController.updateUserProfile
);

//////////////////// Admin: Role ////////////////////
router.patch(
  "/admin/change-user-role",
  auth("updateAny", "user"),
  userValidator.validateUpdateUserRole,
  usersController.changeUserRole
);

router.get(
  "/:role/:id",
  auth("readAny", "user"),
  userValidator.validateFindUserByEmailOrPhone,
  usersController.findUserByEmailOrPhone
);

//////////////////// Admin: Verification ////////////////////
router.patch(
  "/admin/verify-user",
  auth("updateAny", "user"),
  userValidator.validateVerifyUser,
  usersController.verifyUser
);

//////////////////// Admin: Notifications ////////////////////
router.post(
  "/send-notification",
  auth("createAny", "notification"),
  usersController.sendNotification
);

module.exports = router;
