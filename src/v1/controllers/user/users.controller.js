const httpStatus = require("http-status");
const _ = require("lodash");
const {
  User,
  CLIENT_SCHEMA: userSchema,
} = require("../../models/user/user.model");
const {
  CLIENT_SCHEMA: purchaseCarSchema,
} = require("../../models/car/purchaseCar.model");
const {
  usersService,
  excelService,
  purchaseCarsService,
} = require("../../services");
const success = require("../../config/success");
const { Notification, user } = require("../../config/notifications");

module.exports.isAuth = async (req, res, next) => {
  try {
    req.user.updateLastLogin();
    const user = await req.user.save();

    res.status(httpStatus.OK).json(_.pick(user, userSchema));
  } catch (err) {
    next(err);
  }
};

module.exports.verifyEmailOrPhone = (key) => async (req, res, next) => {
  try {
    const user = req.user;
    const { code } = req.body;

    const verifiedUser = await usersService.verifyEmailOrPhone(key, user, code);

    res.status(httpStatus.OK).json(_.pick(verifiedUser, userSchema));
  } catch (err) {
    next(err);
  }
};

module.exports.resendEmailOrPhoneVerificationCode =
  (key) => async (req, res, next) => {
    try {
      const user = req.user;

      await usersService.resendEmailOrPhoneVerificationCode(key, user);

      const response = {
        ok: true,
        message: success.auth[`${key}VerificationCodeSent`],
      };

      res.status(httpStatus.OK).json(response);
    } catch (err) {
      next(err);
    }
  };

module.exports.changePassword = async (req, res, next) => {
  try {
    const user = req.user;
    const { oldPassword, newPassword } = req.body;

    await usersService.changePassword(user, oldPassword, newPassword);

    const response = {
      user: _.pick(user, userSchema),
      token: user.genAuthToken(),
    };

    res.status(httpStatus.CREATED).json(response);
  } catch (err) {
    next(err);
  }
};

module.exports.sendForgotPasswordCode = async (req, res, next) => {
  try {
    let { emailOrPhone, sendTo, lang } = req.query;
    if (!emailOrPhone.includes("@")) {
      emailOrPhone = `+${emailOrPhone.trim()}`;
    }

    await usersService.sendForgotPasswordCode(emailOrPhone, sendTo, lang);

    const response = {
      ok: true,
      message:
        sendTo === "phone"
          ? success.auth.passwordResetCodeSentToPhone
          : success.auth.passwordResetCodeSentToEmail,
    };

    res.status(httpStatus.OK).json(response);
  } catch (err) {
    next(err);
  }
};

module.exports.handleForgotPassword = async (req, res, next) => {
  try {
    const { emailOrPhone, code, newPassword } = req.body;

    const user = await usersService.resetPasswordWithCode(
      emailOrPhone,
      code,
      newPassword
    );

    const response = {
      user: _.pick(user, userSchema),
      token: user.genAuthToken(),
    };

    res.status(httpStatus.OK).json(response);
  } catch (err) {
    next(err);
  }
};

module.exports.updateProfile = async (req, res, next) => {
  try {
    const user = req.user;
    const { name, email, phoneICC, phoneNSN } = req.body;
    const avatar = req?.files?.avatar || null;

    const info = await usersService.updateProfile(
      user,
      name,
      email,
      phoneICC,
      phoneNSN,
      avatar
    );

    const response = {
      user: _.pick(info.newUser, userSchema),
      changes: info.changes,
      token: info.newUser.genAuthToken(),
    };

    res.status(httpStatus.CREATED).json(response);
  } catch (err) {
    next(err);
  }
};

module.exports.switchLanguage = async (req, res, next) => {
  try {
    const user = req.user;

    const updatedUser = await usersService.switchLanguage(user);

    const response = _.pick(updatedUser, userSchema);

    res.status(httpStatus.OK).json(response);
  } catch (err) {
    next(err);
  }
};

module.exports.sendNotification = async (req, res, next) => {
  try {
    const { userIds, titleEN, titleAR, bodyEN, bodyAR } = req.body;

    const notification = new Notification(titleEN, titleAR, bodyEN, bodyAR);
    await usersService.sendNotification(userIds, notification);

    res.status(httpStatus.OK).json(notification);
  } catch (err) {
    next(err);
  }
};

module.exports.seeNotifications = async (req, res, next) => {
  try {
    const user = req.user;

    const notifications = await usersService.seeNotifications(user);

    res.status(httpStatus.OK).json({ notifications });
  } catch (err) {
    next(err);
  }
};

module.exports.clearNotifications = async (req, res, next) => {
  try {
    const user = req.user;

    const notifications = await usersService.clearNotifications(user);

    res.status(httpStatus.CREATED).json({ notifications });
  } catch (err) {
    next(err);
  }
};

module.exports.addPaymentCard = async (req, res, next) => {
  try {
    const user = req.user;
    const {
      // Shared data
      type,
      postalCode,
      // Visa data
      visaNameOnCard,
      visaCardNumber,
      visaCVC,
      visaExpiryDate,
      // Paypal data
      paypalFirstName,
      paypalLastName,
      paypalAddressLine1,
      paypalAddressLine2,
      paypalCity,
      paypalRegion,
      paypalCountry,
    } = req.body;
  } catch (err) {
    next(err);
  }
};

module.exports.addToFavorites = async (req, res, next) => {
  try {
    const user = req.user;
    const { purchaseCarId } = req.body;

    const favorites = await usersService.addToFavorites(user, purchaseCarId);

    const response = {
      favorites,
    };

    res.status(httpStatus.CREATED).json(response);
  } catch (err) {
    next(err);
  }
};

module.exports.getMyFavorites = async (req, res, next) => {
  try {
    const user = req.user;
    const { page, limit } = req.query;

    const { currentPage, totalPages, purchaseCars } =
      await purchaseCarsService.getMyFavorites(user, page, limit);

    const response = {
      currentPage,
      totalPages,
      purchaseCars: purchaseCars.map((car) => _.pick(car, purchaseCarSchema)),
    };

    res.status(httpStatus.CREATED).json(response);
  } catch (err) {
    next(err);
  }
};

module.exports.deleteFromFavorites = async (req, res, next) => {
  try {
    const user = req.user;
    const { purchaseCarId } = req.query;

    const favorites = await usersService.deleteFromFavorites(
      user,
      purchaseCarId
    );

    const response = {
      favorites,
    };

    res.status(httpStatus.CREATED).json(response);
  } catch (err) {
    next(err);
  }
};

///////////////////////////// ADMIN /////////////////////////////
module.exports.updateUserProfile = async (req, res, next) => {
  try {
    const { emailOrPhone, name, email, phoneICC, phoneNSN } = req.body;
    const avatar = req?.files?.avatar || null;

    const info = await usersService.updateUserProfile(
      emailOrPhone,
      name,
      email,
      phoneICC,
      phoneNSN,
      avatar
    );

    const response = {
      user: _.pick(info.newUser, userSchema),
      changes: info.changes,
      token: info.newUser.genAuthToken(),
    };

    res.status(httpStatus.CREATED).json(response);
  } catch (err) {
    next(err);
  }
};

module.exports.verifyUser = async (req, res, next) => {
  try {
    const { emailOrPhone } = req.body;

    const updatedUser = await usersService.verifyUser(emailOrPhone);

    res.status(httpStatus.CREATED).json(_.pick(updatedUser, userSchema));
  } catch (err) {
    next(err);
  }
};

module.exports.changeUserRole = async (req, res, next) => {
  try {
    const { emailOrPhone, role } = req.body;

    const updatedUser = await usersService.changeUserRole(emailOrPhone, role);

    res.status(httpStatus.CREATED).json(_.pick(updatedUser, userSchema));
  } catch (err) {
    next(err);
  }
};

module.exports.findUserByEmailOrPhone = async (req, res, next) => {
  try {
    let { emailOrPhone, role } = req.query;

    if (!emailOrPhone.includes("@") && !emailOrPhone.startsWith("+")) {
      emailOrPhone = `+${emailOrPhone}`;
    }

    const user = await usersService.findUserByEmailOrPhone(
      emailOrPhone,
      role,
      true
    );

    res.status(httpStatus.OK).json(_.pick(user, userSchema));
  } catch (err) {
    next(err);
  }
};

module.exports.getCarsStatus = async (req, res, next) => {
  try {
    const status = await usersService.getCarsStatus();

    res.status(httpStatus.OK).json(status);
  } catch (err) {
    next(err);
  }
};

module.exports.exportUsersToExcel = async (req, res, next) => {
  try {
    const users = await User.find({}).sort({ _id: -1 });

    // Get the path to the excel file
    const filePath = await excelService.exportUsersToExcelFile(users);

    // Create the response object
    const response = {
      type: "file/xlsx",
      path: filePath,
    };

    // Send response back to the client
    res.status(httpStatus.CREATED).json(response);
  } catch (err) {
    next(err);
  }
};

module.exports.deliverPaymentToOffice = async (req, res, next) => {
  try {
    const { userId: officeId } = req.params;
    const { amount } = req.body;

    const office = await usersService.deliverPaymentToOffice(officeId, amount);

    // Send notification to admin
    const notificationForAdmin = user.paymentDeliveredForAdmin(
      amount,
      office.email
    );
    await usersService.sendNotificationToAdmins(notificationForAdmin);

    // Send notification to office
    const notificationForOffice = user.paymentDeliveredForOffice(amount);
    await usersService.sendNotification([office._id], notificationForOffice);

    const response = success.user.paymentDeliveredToOffice;

    res.status(httpStatus.OK).json(response);
  } catch (err) {
    next(err);
  }
};
