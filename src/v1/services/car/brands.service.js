const { Brand } = require("../../models/car/brand.model");
const { ApiError } = require("../../middleware/apiError");
const localStorage = require("../storage/localStorage.service");
const httpStatus = require("http-status");
const errors = require("../../config/errors");

//////////////////// Internal Services ////////////////////
module.exports.getBrand = async (brandId) => {
  try {
    const brand = await Brand.findById(brandId);
    if (!brand) {
      const statusCode = httpStatus.NOT_FOUND;
      const message = errors.brand.notFound;
      throw new ApiError(statusCode, message);
    }

    return brand;
  } catch (err) {
    throw err;
  }
};

//////////////////// Routes Services ////////////////////
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

module.exports.addBrand = async (nameEN, nameAR, photo) => {
  try {
    const _photo = await localStorage.storeFile(photo);

    const brand = new Brand({
      photoURL: _photo.path,
      name: {
        en: nameEN,
        ar: nameAR,
      },
    });

    await brand.save();

    return brand;
  } catch (err) {
    if (err.code === errors.codes.duplicateIndexKey) {
      const statusCode = httpStatus.BAD_REQUEST;
      const message = errors.brand.alreadyExists;
      err = new ApiError(statusCode, message);
    }

    throw err;
  }
};
