const request = require("request");
const { errors } = require("../../config");
const { ApiError } = require("../../middleware/apiError");
const httpStatus = require("http-status");

const addTransactionURL = "https://api.fatora.io/v1/payments/checkout";
const sandboxApiKey = "E4B73FEE-F492-4607-A38D-852B0EBC91C9";
const liveApiKey = process.env["FATORA_API_KEY"];
const apiKey = liveApiKey || sandboxApiKey;

module.exports.addFatoraTransaction = async (
  user,
  order,
  onSuccess,
  onFail
) => {
  try {
    const data = {
      amount: order.totalPrice,
      currency: "AED",
      order_id: order._id,
      client: {
        name: user.name,
        phone: user.phone.full,
        email: user.email,
      },
      language: user.favLang,
      success_url: "",
      failure_url: "",
      fcm_token: user.deviceToken,
      save_token: true,
      note: "",
    };

    const options = {
      json: data,
      headers: { "Content-Type": "application/json", api_key: apiKey },
    };

    const callback = function (error, presponse, body) {
      if (!error && presponse.statusCode == 200) onSuccess();
      else onFail();
    };

    request.post(addTransactionURL, options, callback);
  } catch (err) {
    const statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    const message = errors.fatora.somethingWrong;
    throw new ApiError(statusCode, message);
  }
};

module.exports.verifyFatoraTransaction = async (
  orderId,
  bankTransactionId,
  onSuccess,
  onFail
) => {
  try {
    const data = {
      order_id: orderId,
      transaction_id: bankTransactionId,
    };

    const options = {
      json: data,
      headers: { "Content-Type": "application/json", api_key: apiKey },
    };

    const callback = function (error, presponse, body) {
      if (!error && presponse.statusCode == 200) onSuccess();
      else onFail();
    };

    request.post(addTransactionURL, options, callback);
  } catch (err) {
    throw err;
  }
};
