const { check } = require("express-validator");
const errors = require("../../../config/errors");
const commonMiddleware = require("../common");

const getAllRentCarsValidator = [
  (req, res, next) => {
    req.body.skip = req.query.skip;
    next();
  },
  commonMiddleware.checkSkip,
  commonMiddleware.next,
];

module.exports = {
  getAllRentCarsValidator,
};
