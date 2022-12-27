const { CLIENT_SCHEMA: brandSchema } = require("../../models/car/brand.model");
const { brandsService } = require("../../services");
const httpStatus = require("http-status");
const _ = require("lodash");

module.exports.getPopularBrands = async (req, res, next) => {
  try {
    const { skip } = req.query;

    const brands = await brandsService.getPopularBrands(skip);

    const response = {
      brands: brands.map((brand) => _.pick(brand, brandSchema)),
    };

    res.status(httpStatus.OK).json(response);
  } catch (err) {
    next(err);
  }
};

module.exports.addBrand = async (req, res, next) => {
  try {
    const { nameEN, nameAR } = req.body;
    const photo = req?.files?.photo;

    const brand = await brandsService.addBrand(nameEN, nameAR, photo);

    const response = _.pick(brand, brandSchema);

    res.status(httpStatus.CREATED).json(response);
  } catch (err) {
    next(err);
  }
};
