const admin = require("firebase-admin");
const FCM = require("fcm-notification");
const serviceAccount = require("../../config/system/service-account.json");
const certPath = admin.credential.cert(serviceAccount);
const errors = require("../../config/errors");
const httpStatus = require("http-status");
const { ApiError } = require("../../middleware/apiError");

const fcm = new FCM(certPath);

module.exports.sendPushNotification = (title, body, tokens, callback) => {
  try {
    tokens = filterTokens(tokens);

    let payload = {
      data: {},
      notification: {
        title,
        body,
      },
    };

    fcm.sendToMultipleToken(payload, tokens, callback);
  } catch (err) {
    const statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    const message = errors.user.errorSendingNotification;
    throw new ApiError(statusCode, message);
  }
};

const filterTokens = (tokens = []) =>
  tokens.filter((token) => token && token !== "token");
