const nodemailer = require("nodemailer");
const { mail } = require("../../config/system");
const httpStatus = require("http-status");
const errors = require("../../config/errors");
const { ApiError } = require("../../middleware/apiError");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  secure: true,
  auth: {
    user: mail.auth.user,
    pass: mail.auth.password,
  },
});

module.exports.registerEmail = async (lang, email, user) => {
  try {
    if (!["ar", "en"].includes(lang)) {
      lang = "ar";
    }

    const {
      subject,
      emailBody: { title, greeting },
    } = mail.types.register;

    const mailGenerator = mail.getMailGenerator(lang);

    const emailBody = mail.getEmailBody(
      mailGenerator,
      title[lang](user),
      greeting[lang],
      user
    );

    const message = mail.getMessage(email, emailBody, subject[lang]);

    await transporter.sendMail(message);
    return true;
  } catch (err) {
    const statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    const message = errors.system.emailError;
    throw new ApiError(statusCode, message);
  }
};

module.exports.changeEmail = async (lang, email, user) => {
  try {
    if (!["ar", "en"].includes(lang)) {
      lang = "ar";
    }

    const {
      subject,
      emailBody: { title, greeting },
    } = mail.types.changeEmail;

    const mailGenerator = mail.getMailGenerator(lang);

    const emailBody = mail.getEmailBody(
      mailGenerator,
      title[lang](user),
      greeting[lang],
      user
    );

    const message = mail.getMessage(email, emailBody, subject[lang]);

    await transporter.sendMail(message);
    return true;
  } catch (err) {
    const statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    const message = errors.system.emailError;
    throw new ApiError(statusCode, message);
  }
};

module.exports.forgotPasswordEmail = async (lang, email, user) => {
  try {
    if (!["ar", "en"].includes(lang)) {
      lang = "ar";
    }

    const {
      subject,
      emailBody: { title, greeting },
    } = mail.types.forgotPassword;

    const mailGenerator = mail.getMailGenerator(lang);

    const emailBody = mail.getEmailBody(
      mailGenerator,
      title[lang](user),
      greeting[lang],
      user
    );

    const message = mail.getMessage(email, emailBody, subject[lang]);

    await transporter.sendMail(message);
    return true;
  } catch (err) {
    const statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    const message = errors.system.emailError;
    throw new ApiError(statusCode, message);
  }
};
