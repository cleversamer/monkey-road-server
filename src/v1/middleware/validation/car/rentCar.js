const { check } = require("express-validator");
const errors = require("../../../config/errors");
const commonMiddleware = require("../common");

const getAllRentCarsValidator = [
  commonMiddleware.checkSkip,
  commonMiddleware.next,
];

module.exports = {
  getAllRentCarsValidator,
};
