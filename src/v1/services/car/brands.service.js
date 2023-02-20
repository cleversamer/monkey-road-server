const { Brand } = require("../../models/car/brand.model");
const { ApiError } = require("../../middleware/apiError");
const localStorage = require("../storage/localStorage.service");
const cloudStorage = require("../cloud/cloudStorage.service");
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
      .sort({ "noOfCars.rental": -1 })
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
    // Check if brand name exists
    const isBrandExist = await Brand.findOne({
      $or: [{ "name.en": { $eq: nameEN } }, { "name.ar": { $eq: nameAR } }],
    });
    if (isBrandExist) {
      const statusCode = httpStatus.BAD_REQUEST;
      const message = errors.brand.alreadyExists;
      throw new ApiError(statusCode, message);
    }

    const localPhoto = await localStorage.storeFile(photo);
    const cloudPhoto = await cloudStorage.uploadFile(localPhoto);
    await localStorage.deleteFile(localPhoto.path);

    const brand = new Brand({
      photoURL: cloudPhoto,
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
