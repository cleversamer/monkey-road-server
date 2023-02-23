const { authService, emailService } = require("../../services");
const httpStatus = require("http-status");
const { CLIENT_SCHEMA } = require("../../models/user/user.model");
const _ = require("lodash");

module.exports.registerWithEmail = async (req, res, next) => {
  try {
    const { lang, name, email, phoneICC, phoneNSN, password, deviceToken } =
      req.body;

    const user = await authService.registerWithEmail(
      email,
      password,
      name,
      phoneICC,
      phoneNSN,
      deviceToken,
      lang
    );

    await emailService.registerEmail(lang, email, user);

    // TODO: send phone activation code to user's phone.

    const response = {
      user: _.pick(user, CLIENT_SCHEMA),
      token: user.genAuthToken(),
    };

    res.status(httpStatus.CREATED).json(response);
  } catch (err) {
    next(err);
  }
};

module.exports.registerWithGoogle = async (req, res, next) => {
  try {
    const { lang, googleToken, phoneICC, phoneNSN, deviceToken } = req.body;

    const user = await authService.registerWithGoogle(
      googleToken,
      phoneICC,
      phoneNSN,
      deviceToken,
      lang
    );

    // TODO: send phone activation code to user's phone.

    const response = {
      user: _.pick(user, CLIENT_SCHEMA),
      token: user.genAuthToken(),
    };

    res.status(httpStatus.CREATED).json(response);
  } catch (err) {
    next(err);
  }
};

module.exports.loginWithEmail = async (req, res, next) => {
  try {
    const { emailOrPhone, password, deviceToken } = req.body;

    const user = await authService.loginWithEmail(
      emailOrPhone,
      password,
      deviceToken
    );

    const response = {
      user: _.pick(user, CLIENT_SCHEMA),
      token: user.genAuthToken(),
    };

    res.status(httpStatus.OK).json(response);
  } catch (err) {
    next(err);
  }
};

module.exports.loginWithGoogle = async (req, res, next) => {
  try {
    const { googleToken, deviceToken } = req.body;

    const user = await authService.loginWithGoogle(googleToken, deviceToken);

    const response = {
      user: _.pick(user, CLIENT_SCHEMA),
      token: user.genAuthToken(),
    };

    res.status(httpStatus.OK).json(response);
  } catch (err) {
    next(err);
  }
};
