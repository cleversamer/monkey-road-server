const admin = require("firebase-admin");
const { ApiError } = require("../../middleware/apiError");
const httpStatus = require("http-status");
const errors = require("../../config/errors");
const serviceAccount = require("../../config/system/service-account.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const decodeToken = async (token) => {
  try {
    const decodeValue = await admin.auth().verifyIdToken(token);

    if (!decodeValue) {
      const statusCode = httpStatus.UNAUTHORIZED;
      const message = errors.auth.invalidGoogleToken;
      throw new ApiError(statusCode, message);
    }

    return decodeValue;
  } catch (err) {
    throw err;
  }
};

module.exports = {
  admin,
  decodeToken,
};
