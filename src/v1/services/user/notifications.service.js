const admin = require("firebase-admin");
const FCM = require("fcm-notification");
const serviceAccount = require("../../config/system/service-account.json");
const certPath = admin.credential.cert(serviceAccount);

const fcm = new FCM(certPath);

module.exports.sendPushNotification = (title, body, data, tokens, callback) => {
  try {
    tokens = filterTokens(tokens);

    let payload = {
      data,
      notification: {
        title,
        body,
      },
    };

    fcm.sendToMultipleToken(payload, tokens, callback);
  } catch (err) {
    throw err;
  }
};

const filterTokens = (tokens = []) =>
  tokens.filter((token) => token && token !== "token");
