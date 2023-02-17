const { User } = require("../../models/user/user.model");
const bcrypt = require("bcrypt");
const { ApiError } = require("../../middleware/apiError");
const httpStatus = require("http-status");
const errors = require("../../config/errors");
const usersService = require("./users.service");
const googleService = require("./google.service");

module.exports.registerWithEmail = async (
  email,
  password,
  name,
  phoneICC,
  phoneNSN,
  deviceToken
) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const user = new User({
      authType: "email",
      name,
      email,
      password: hashed,
      phone: {
        full: `${phoneICC}${phoneNSN}`,
        icc: phoneICC,
        nsn: phoneNSN,
      },
    });

    // Updating verification codes to be sent to the user
    user.updateCode("email");
    user.updateCode("phone");

    user.updateDeviceToken(deviceToken);

    return await user.save();
  } catch (err) {
    if (err.code === errors.codes.duplicateIndexKey) {
      const statusCode = httpStatus.FORBIDDEN;
      const message = errors.auth.emailOrPhoneUsed;
      throw new ApiError(statusCode, message);
    }

    throw err;
  }
};

module.exports.registerWithGoogle = async (
  googleToken,
  phoneICC,
  phoneNSN,
  deviceToken
) => {
  try {
    const googleUser = await googleService.decodeToken(googleToken);
    const registeredUser = await usersService.findUserByEmailOrPhone(
      googleUser.email
    );

    if (registeredUser) {
      return registeredUser;
    }

    const newUser = new User({
      authType: "google",
      email: googleUser.email,
      name: googleUser.name,
      phone: {
        full: `${phoneICC}${phoneNSN}`,
        icc: phoneICC,
        nsn: phoneNSN,
      },
      verified: {
        email: true,
        phone: false,
      },
    });

    // Updating verification codes to be sent to the user
    newUser.updateCode("email");
    newUser.updateCode("phone");

    newUser.updateDeviceToken(deviceToken);

    return await newUser.save();
  } catch (err) {
    if (err.code === errors.codes.duplicateIndexKey) {
      const statusCode = httpStatus.FORBIDDEN;
      const message = errors.auth.phoneUsed;
      throw new ApiError(statusCode, message);
    }

    throw err;
  }
};

module.exports.loginWithEmail = async (emailOrPhone, password, deviceToken) => {
  try {
    const user = await usersService.findUserByEmailOrPhone(emailOrPhone);

    // Check if user exist
    if (!user) {
      const statusCode = httpStatus.NOT_FOUND;
      const message = errors.auth.incorrectCredentials;
      throw new ApiError(statusCode, message);
    }

    // Decoding user's password and comparing it with the password argument
    if (!(await user.comparePassword(password))) {
      const statusCode = httpStatus.UNAUTHORIZED;
      const message = errors.auth.incorrectCredentials;
      throw new ApiError(statusCode, message);
    }

    user.updateLastLogin();
    user.updateDeviceToken(deviceToken);

    return await user.save();
  } catch (err) {
    throw err;
  }
};

module.exports.loginWithGoogle = async (googleToken, deviceToken) => {
  try {
    const googleUser = await googleService.decodeToken(googleToken);
    const user = await usersService.findUserByEmailOrPhone(googleUser.email);

    if (!user) {
      const statusCode = httpStatus.NOT_FOUND;
      const message = errors.auth.googleAccNotRegistered;
      throw new ApiError(statusCode, message);
    }

    user.updateLastLogin();
    user.updateDeviceToken(deviceToken);

    await user.save();

    return user;
  } catch (err) {
    throw err;
  }
};
