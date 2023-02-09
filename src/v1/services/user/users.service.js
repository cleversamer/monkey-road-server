const { User } = require("../../models/user/user.model");
const jwt = require("jsonwebtoken");
const httpStatus = require("http-status");
const emailService = require("./email.service");
const notificationsService = require("./notifications.service");
const rentCarsService = require("../car/rentCars.service");
const purchaseCarsService = require("../car/purchaseCars.service");
const localStorage = require("../storage/localStorage.service");
const { ApiError } = require("../../middleware/apiError");
const errors = require("../../config/errors");

module.exports.findUserByEmailOrPhone = async (
  emailOrPhone,
  role = "",
  withError = false
) => {
  try {
    // Find user by email or phone
    const user = await User.findOne({
      $or: [
        { email: { $eq: emailOrPhone } },
        { "phone.full": { $eq: emailOrPhone } },
      ],
    });

    // Throwing error if no user found and `throwError = true`
    if (withError && !user) {
      const statusCode = httpStatus.NOT_FOUND;
      const message = errors.user.notFound;
      throw new ApiError(statusCode, message);
    }

    // Throwing error if a user was found but the specified `role` does not match
    // This happens in case of role is added as an argument
    // If role is falsy that means this search does not care of role
    if (withError && user && role && user.role !== role) {
      const statusCode = httpStatus.NOT_FOUND;
      const message = errors.user.foundWithInvalidRole;
      throw new ApiError(statusCode, message);
    }

    return user;
  } catch (err) {
    throw err;
  }
};

module.exports.findUserById = async (userId) => {
  try {
    return await User.findById(userId);
  } catch (err) {
    throw err;
  }
};

module.exports.validateToken = (token) => {
  try {
    return jwt.verify(token, process.env["JWT_PRIVATE_KEY"]);
  } catch (err) {
    throw err;
  }
};

module.exports.verifyEmailOrPhone = async (key, user, code) => {
  try {
    // Ensure that key is correct
    key = key.toLowerCase();
    if (!["email", "phone"].includes(key)) {
      key = "email";
    }

    // Check if user's email or phone is verified
    const isVerified =
      key === "email" ? user.isEmailVerified() : user.isPhoneVerified();
    if (isVerified) {
      const statusCode = httpStatus.BAD_REQUEST;
      const message = errors.user[`${key}AlreadyVerified`];
      throw new ApiError(statusCode, message);
    }

    // Check if code is correct
    const isCorrectCode = user.isMatchingCode(key, code);
    if (!isCorrectCode) {
      const statusCode = httpStatus.BAD_REQUEST;
      const message = errors.auth.incorrectCode;
      throw new ApiError(statusCode, message);
    }

    // Check if code is expired
    const isValidCode = user.isValidCode(key);
    if (!isValidCode) {
      const statusCode = httpStatus.BAD_REQUEST;
      const message = errors.auth.expiredCode;
      throw new ApiError(statusCode, message);
    }

    // Verify user's email or phone
    if (key === "email") {
      user.verifyEmail();
    } else {
      user.verifyPhone();
    }

    return await user.save();
  } catch (err) {
    throw err;
  }
};

module.exports.resendEmailOrPhoneVerificationCode = async (key, user, lang) => {
  try {
    // Ensure that key is correct
    key = key.toLowerCase();
    if (!["email", "phone"].includes(key)) {
      key = "email";
    }

    // Check if user's email or phone is verified
    const isVerified =
      key === "email" ? user.isEmailVerified() : user.isPhoneVerified();
    if (isVerified) {
      const statusCode = httpStatus.BAD_REQUEST;
      const message = errors.user[`${key}AlreadyVerified`];
      throw new ApiError(statusCode, message);
    }

    // Update user's email or phone verification code
    // Send code in a message to user's email or phone
    // Save user
    user.updateCode(key);
    await user.save();

    // Sending email or phone verification code to user's email or phone
    if (key === "email")
      await emailService.registerEmail(lang, user.email, user);

    // TODO: send phone verification code to user's phone
  } catch (err) {
    throw err;
  }
};

module.exports.changePassword = async (user, oldPassword, newPassword) => {
  try {
    // Decoding user's password and comparing it with the old password
    if (!(await user.comparePassword(oldPassword))) {
      const statusCode = httpStatus.UNAUTHORIZED;
      const message = errors.auth.incorrectOldPassword;
      throw new ApiError(statusCode, message);
    }

    // Decoding user's password and comparing it with the new password
    if (await user.comparePassword(newPassword)) {
      const statusCode = httpStatus.BAD_REQUEST;
      const message = errors.auth.oldPasswordMatchNew;
      throw new ApiError(statusCode, message);
    }

    // Update password
    await user.updatePassword(newPassword);

    // Save user
    await user.save();
  } catch (err) {
    throw err;
  }
};

module.exports.sendForgotPasswordCode = async (emailOrPhone, sendTo, lang) => {
  try {
    // Check if user exists
    const user = await this.findUserByEmailOrPhone(emailOrPhone);
    if (!user) {
      const statusCode = httpStatus.NOT_FOUND;
      const message = errors.auth.emailOrPhoneNotUsed;
      throw new ApiError(statusCode, message);
    }

    // Update password reset code
    user.updateCode("password");
    const updatedUser = await user.save();

    // Send password reset code to phone or
    if (sendTo === "phone") {
      // TODO: send forgot password code to user's phone.
    } else {
      await emailService.forgotPasswordEmail(lang, user.email, updatedUser);
    }
  } catch (err) {
    throw err;
  }
};

module.exports.resetPasswordWithCode = async (
  emailOrPhone,
  code,
  newPassword
) => {
  try {
    // Check if user exists
    const user = await this.findUserByEmailOrPhone(emailOrPhone);
    if (!user) {
      const statusCode = httpStatus.NOT_FOUND;
      const message = errors.auth.emailNotUsed;
      throw new ApiError(statusCode, message);
    }

    // Check if code is correct
    const isCorrectCode = user.isMatchingCode("password", code);
    if (!isCorrectCode) {
      const statusCode = httpStatus.BAD_REQUEST;
      const message = errors.auth.incorrectCode;
      throw new ApiError(statusCode, message);
    }

    // Check if code is expired
    const isValidCode = user.isValidCode("password");
    if (!isValidCode) {
      const statusCode = httpStatus.BAD_REQUEST;
      const message = errors.auth.expiredCode;
      throw new ApiError(statusCode, message);
    }

    // Update password
    await user.updatePassword(newPassword);

    return await user.save();
  } catch (err) {
    throw err;
  }
};

module.exports.updateProfile = async (
  lang,
  user,
  name,
  email,
  phoneICC,
  phoneNSN,
  avatar
) => {
  try {
    const body = {
      lang,
      user,
      name,
      email,
      phoneICC,
      phoneNSN,
      avatar,
    };

    return await updateUserProfile(user, body);
  } catch (err) {
    throw err;
  }
};

module.exports.sendNotification = async (
  userIds,
  title,
  body,
  data,
  callback
) => {
  try {
    // Find users and map them to an array of device tokens.
    const users = await User.find({ _id: { $in: userIds } });
    const tokens = users.map((user) => {
      // Add the notification to user's notifications array
      // Save the user to the database
      user.addNotification(title, body, data);
      user.save();

      return user.deviceToken;
    });

    notificationsService.sendPushNotification(
      title,
      body,
      data,
      tokens,
      callback
    );

    return true;
  } catch (err) {
    throw err;
  }
};

module.exports.seeNotifications = async (user) => {
  try {
    // Check all user's notifications
    const { isAllSeen, list } = user.seeNotifications();

    // Throw an error in case of all user's notifications
    // are already seen
    if (isAllSeen) {
      const statusCode = httpStatus.BAD_REQUEST;
      const message = errors.user.notificationsSeen;
      throw new ApiError(statusCode, message);
    }

    // Save the user
    await user.save();

    // Return user's notifications
    return list;
  } catch (err) {
    throw err;
  }
};

module.exports.clearNotifications = async (user) => {
  try {
    // Clear notifications
    const isEmpty = user.clearNotifications();

    // Check if notifications are empty
    if (isEmpty) {
      const statusCode = httpStatus.BAD_REQUEST;
      const message = errors.user.noNotifications;
      throw new ApiError(statusCode, message);
    }

    // Save the user
    await user.save();

    // Return user's notifications
    return user.notifications;
  } catch (err) {
    throw err;
  }
};

module.exports.addToFavorites = async (user, purchaseCarId) => {
  try {
    const purchaseCar = await purchaseCarsService.getPurchaseCarDetails(
      purchaseCarId
    );
    if (!purchaseCar) {
      const statusCode = httpStatus.NOT_FOUND;
      const message = errors.purchaseCar.notFound;
      throw new ApiError(statusCode, message);
    }

    user.addToFavorites(purchaseCar._id);
    await user.save();

    return true;
  } catch (err) {
    throw err;
  }
};

module.exports.getMyFavorites = async (user) => {
  try {
    if (!user.favorites || !user.favorites.length) {
      const statusCode = httpStatus.NOT_FOUND;
      const message = errors.user.noFavorites;
      throw new ApiError(statusCode, message);
    }

    const favorites = await purchaseCarsService.findPurchaseCars(
      user.favorites
    );

    if (!favorites || !favorites.length) {
      const statusCode = httpStatus.NOT_FOUND;
      const message = errors.user.noFavorites;
      throw new ApiError(statusCode, message);
    }

    return favorites;
  } catch (err) {
    throw err;
  }
};

module.exports.deleteFromFavorites = async (user, purchaseCarId) => {
  try {
    if (!user.favorites || !user.favorites.length) {
      const statusCode = httpStatus.NOT_FOUND;
      const message = errors.user.noFavorites;
      throw new ApiError(statusCode, message);
    }

    user.removeFromFavorites(purchaseCarId);
    await user.save();

    return true;
  } catch (err) {
    throw err;
  }
};

///////////////////////////// ADMIN /////////////////////////////
module.exports.changeUserRole = async (emailOrPhone, role) => {
  try {
    // Check if user exists
    const user = await this.findUserByEmailOrPhone(emailOrPhone);
    if (!user) {
      const statusCode = httpStatus.NOT_FOUND;
      const message = errors.user.notFound;
      throw new ApiError(statusCode, message);
    }

    // Update user's role
    user.role = role;

    return await user.save();
  } catch (err) {
    throw err;
  }
};

module.exports.verifyUser = async (emailOrPhone) => {
  try {
    // Check if used exists
    const user = await this.findUserByEmailOrPhone(emailOrPhone);
    if (!user) {
      const statusCode = httpStatus.NOT_FOUND;
      const message = errors.user.notFound;
      throw new ApiError(statusCode, message);
    }

    // Check if user's email and phone are already verified
    if (user.verified.email && user.verified.phone) {
      const statusCode = httpStatus.BAD_REQUEST;
      const message = errors.user.alreadyVerified;
      throw new ApiError(statusCode, message);
    }

    // Verify user's email and phone
    user.verifyEmail();
    user.verifyPhone();

    return await user.save();
  } catch (err) {
    throw err;
  }
};

module.exports.updateUserProfile = async (
  lang,
  emailOrPhone,
  name,
  email,
  phoneICC,
  phoneNSN,
  avatar
) => {
  try {
    // Checking if user exists
    const user = await this.findUserByEmailOrPhone(emailOrPhone);
    if (!user) {
      const statusCode = httpStatus.NOT_FOUND;
      const message = errors.user.notFound;
      throw new ApiError(statusCode, message);
    }

    const body = {
      lang,
      emailOrPhone,
      name,
      email,
      phoneICC,
      phoneNSN,
      avatar,
    };

    return await updateUserProfile(user, body);
  } catch (err) {
    throw err;
  }
};

const updateUserProfile = async (user, body) => {
  try {
    const { lang, name, email, phoneICC, phoneNSN, avatar } = body;

    // To store data changes
    const changes = [];

    // Updating name when there's new name
    if (name && user.name !== name) {
      user.name = name;
      changes.push("name");
    }

    // Updating avatar when there's new avatar
    if (avatar) {
      const file = await localStorage.storeFile(avatar);
      await localStorage.deleteFile(user.avatarURL);
      user.avatarURL = file.path;
      changes.push("avatarURL");
    }

    // Updating email, setting email as not verified,
    // update email verification code, and sending
    // email verification code to user's email
    if (email && user.email !== email) {
      // Checking if email used
      const emailUsed = await this.findUserByEmailOrPhone(email);
      if (emailUsed) {
        const statusCode = httpStatus.NOT_FOUND;
        const message = errors.auth.emailUsed;
        throw new ApiError(statusCode, message);
      }

      // Updating email, setting email as not verified,
      // update email verification code, and sending
      // email verification code to user's email
      user.email = email;
      user.verified.email = false;
      changes.push("email");
      user.updateCode("email");
      await emailService.changeEmail(lang, email, user);
    }

    // Updating phone, setting phone as not verified,
    // update phone verification code, and sending
    // phone verification code to user's phone
    const isPhoneEqual =
      user.phone.icc === phoneICC && user.phone.nsn === phoneNSN;
    if ((phoneICC || phoneNSN) && !isPhoneEqual) {
      // Checking if phone used
      const fullPhone = `${phoneICC}${phoneNSN}`;
      const phoneUsed = await this.findUserByEmailOrPhone(fullPhone);
      if (phoneUsed) {
        const statusCode = httpStatus.NOT_FOUND;
        const message = errors.auth.phoneUsed;
        throw new ApiError(statusCode, message);
      }

      // Updating email, setting email as not verified,
      // update email verification code, and sending
      // email verification code to user's email
      user.phone = {
        full: `${phoneICC}${phoneNSN}`,
        icc: phoneICC,
        nsn: phoneNSN,
      };
      user.verified.phone = false;
      changes.push("phone");
      user.updateCode("phone");

      // TODO: send phone verification code to user's email.
    }

    if (!changes.length) {
      const statusCode = httpStatus.BAD_REQUEST;
      const message = errors.user.notUpdated;
      throw new ApiError(statusCode, message);
    }

    user = await user.save();

    return { newUser: user, changes };
  } catch (err) {
    throw err;
  }
};

module.exports.getCarsStatus = async () => {
  try {
    const rentStatus = await rentCarsService.getRentCarsStatus();
    const purchaseStatus = await purchaseCarsService.getPurchaseCarsStatus();

    return {
      rent: rentStatus,
      purchase: purchaseStatus,
    };
  } catch (err) {
    throw err;
  }
};
