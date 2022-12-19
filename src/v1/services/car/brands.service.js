const { Brand } = require("../../models/car/brand.model");
const localStorage = require("../../services/storage/localStorage.service");
const { ApiError } = require("../../middleware/apiError");
const httpStatus = require("http-status");
const errors = require("../../config/errors");

module.exports.getPopularBrands = async (skip) => {
  try {
    const brands = await Brand.find({})
      .sort({ noOfCars: -1 })
      .skip(skip)
      .limit(10);
    if (!brands || !brands.length) {
      const statusCode = httpStatus.NOT_FOUND;
      const message = errors.brand.noBrands;
      throw new ApiError(statusCode, message);
    }

    return brands;
  } catch (err) {
    throw err;
  }
};
