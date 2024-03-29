const { CLIENT_SCHEMA: brandSchema } = require("../../models/car/brand.model");
const { brandsService, usersService } = require("../../services");
const httpStatus = require("http-status");
const _ = require("lodash");
const { notifications } = require("../../config");

module.exports.getPopularBrands = async (req, res, next) => {
  try {
    const { page, limit } = req.query;

    const { currentPage, totalPages, brands } =
      await brandsService.getPopularBrands(page, limit);

    const response = {
      currentPage,
      totalPages,
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

    // Send notification to admin
    const notificationForAdmin = notifications.brand.brandAddedForAdmin(
      brand.name,
      brand.photoURL
    );
    await usersService.sendNotificationToAdmins(notificationForAdmin);

    // Send notification to all users
    const notificationForAllUsers = notifications.brand.brandAddedForAllUsers(
      brand.name,
      brand.photoURL
    );
    await usersService.sendNotification([], notificationForAllUsers);

    const response = _.pick(brand, brandSchema);

    res.status(httpStatus.CREATED).json(response);
  } catch (err) {
    next(err);
  }
};
