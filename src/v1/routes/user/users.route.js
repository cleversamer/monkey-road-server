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
  .route("/verify-phone")
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
  authValidator.changePasswordValidator,
  auth("updateOwn", "password"),
  usersController.changePassword
);

//////////////////// User: Profile ////////////////////
router.patch(
  "/update",
  userValidator.validateUpdateProfile,
  auth("updateOwn", "user"),
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
router.post(
  "/favorites/add",
  auth("createOwn", "favorites"),
  usersController.addToFavorites
);

router.get(
  "/favorites/my",
  auth("readOwn", "favorites"),
  usersController.getMyFavorites
);

// TODO:
router.delete(
  "/favorites/delete",
  auth("deleteOwn", "favorites"),
  usersController.deleteFromFavorites
);

//////////////////// Admin: Profile ////////////////////
router.patch(
  "/admin/update-profile",
  userValidator.validateUpdateUserProfile,
  auth("updateAny", "user"),
  usersController.updateUserProfile
);

//////////////////// Admin: Role ////////////////////
router.patch(
  "/admin/change-user-role",
  userValidator.validateUpdateUserRole,
  auth("updateAny", "user"),
  usersController.changeUserRole
);

router.get(
  "/:role/:id",
  userValidator.validateFindUserByEmailOrPhone,
  auth("readAny", "user"),
  usersController.findUserByEmailOrPhone
);

//////////////////// Admin: Verification ////////////////////
router.patch(
  "/admin/verify-user",
  userValidator.validateVerifyUser,
  auth("updateAny", "user"),
  usersController.verifyUser
);

//////////////////// Admin: Notifications ////////////////////
router.post(
  "/send-notification",
  auth("createAny", "notification"),
  usersController.sendNotification
);

module.exports = router;
