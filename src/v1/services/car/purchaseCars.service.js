const { PurchaseCar } = require("../../models/car/purchaseCar.model");
const brandsService = require("./brands.service");
const localStorage = require("../../services/storage/localStorage.service");
const cloudStorage = require("../../services/cloud/cloudStorage.service");
const { ApiError } = require("../../middleware/apiError");
const httpStatus = require("http-status");
const errors = require("../../config/errors");

//////////////////// Internal Services ////////////////////
module.exports.getMyFavorites = async (user, page, limit) => {
  try {
    page = parseInt(page);
    limit = parseInt(limit);

    if (!user.favorites || !user.favorites.length) {
      const statusCode = httpStatus.NOT_FOUND;
      const message = errors.user.noFavorites;
      throw new ApiError(statusCode, message);
    }

    const purchaseCars = await PurchaseCar.find({
      _id: { $in: user.favorites },
    })
      .skip((page - 1) * limit)
      .limit(limit);

    if (!purchaseCars || !purchaseCars.length) {
      const statusCode = httpStatus.NOT_FOUND;
      const message = errors.user.noFavorites;
      throw new ApiError(statusCode, message);
    }

    const count = await PurchaseCar.count({
      _id: { $in: user.favorites },
    });

    return {
      purchaseCars,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
    };
  } catch (err) {
    throw err;
  }
};

module.exports.getPurchaseCarsStatus = async () => {
  try {
    const purchaseCars = await PurchaseCar.find({});

    const totalCount = purchaseCars.length;

    return {
      total: totalCount,
    };
  } catch (err) {
    throw err;
  }
};

//////////////////// Routes Services ////////////////////
module.exports.getPurchaseCarDetails = async (carId) => {
  try {
    // Check if purchase car exists
    const purchaseCar = await PurchaseCar.findById(carId);
    if (!purchaseCar) {
      const statusCode = httpStatus.NOT_FOUND;
      const message = errors.purchaseCar.notFound;
      throw new ApiError(statusCode, message);
    }

    // Clear seller phone number if car is sold
    if (purchaseCar.isSold()) {
      purchaseCar.phoneNumber = "";
    }

    return purchaseCar;
  } catch (err) {
    throw err;
  }
};

module.exports.getRecentlyArrivedPurchaseCars = async (page, limit) => {
  try {
    page = parseInt(page);
    limit = parseInt(limit);

    let purchaseCars = await PurchaseCar.find({})
      .sort({ _id: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    // Check if there are no cars
    if (!purchaseCars || !purchaseCars.length) {
      const statusCode = httpStatus.NOT_FOUND;
      const message = errors.purchaseCar.noCars;
      throw new ApiError(statusCode, message);
    }

    const count = await PurchaseCar.count({});

    // Clear phone number for sold cars
    purchaseCars = purchaseCars.map((car) => ({
      ...car._doc,
      phoneNumber: car.sold ? "" : car.phoneNumber,
    }));

    return {
      purchaseCars,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
    };
  } catch (err) {
    throw err;
  }
};

module.exports.getLatestModelsPurchaseCars = async (page, limit) => {
  try {
    page = parseInt(page);
    limit = parseInt(limit);

    let purchaseCars = await PurchaseCar.find({})
      .skip((page - 1) * limit)
      .limit(limit);

    // Check if there are no cars
    if (!purchaseCars || !purchaseCars.length) {
      const statusCode = httpStatus.NOT_FOUND;
      const message = errors.purchaseCar.noCars;
      throw new ApiError(statusCode, message);
    }

    const count = await PurchaseCar.count({});

    // Clear phone number for sold cars
    purchaseCars = purchaseCars.map((car) => ({
      ...car._doc,
      phoneNumber: car.sold ? "" : car.phoneNumber,
    }));

    return {
      purchaseCars,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
    };
  } catch (err) {
    throw err;
  }
};

module.exports.getBestSellerPurchaseCars = async (page, limit) => {
  try {
    page = parseInt(page);
    limit = parseInt(limit);

    let purchaseCars = await PurchaseCar.find({})
      .sort({ model: 1 })
      .skip((page - 1) * limit)
      .limit(limit);

    // Check if there are no cars
    if (!purchaseCars || !purchaseCars.length) {
      const statusCode = httpStatus.NOT_FOUND;
      const message = errors.purchaseCar.noCars;
      throw new ApiError(statusCode, message);
    }

    const count = await PurchaseCar.count({});

    // Clear phone number for sold cars
    purchaseCars = purchaseCars.map((car) => ({
      ...car._doc,
      phoneNumber: car.sold ? "" : car.phoneNumber,
    }));

    return {
      purchaseCars,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
    };
  } catch (err) {
    throw err;
  }
};

module.exports.searchPurchaseCars = async (
  searchTerm,
  page,
  limit,
  minPrice,
  maxPrice,
  brands,
  colors,
  years
) => {
  try {
    page = parseInt(page);
    limit = parseInt(limit);

    const match = {
      $text: { $search: searchTerm },
    };

    // if (minPrice) {
    //   match["price.daily"] = { $min: minPrice };
    // }

    // if (maxPrice) {
    //   match["price.daily"] = { $max: maxPrice };
    // }

    if (Array.isArray(brands) && brands.length) {
      match["brand.ref"] = { $in: brands };
    }

    if (Array.isArray(colors) && colors.length) {
      match["color.en"] = { $in: colors };
    }

    if (Array.isArray(years) && years.length) {
      match["year"] = { $in: years };
    }

    let purchaseCars = await PurchaseCar.aggregate([
      { $match: match },
      { $sort: { score: { $meta: "textScore" } } },
      { $skip: (page - 1) * limit },
      { $limit: limit },
    ]);

    // Check if there are no cars
    if (!purchaseCars || !purchaseCars.length) {
      const statusCode = httpStatus.NOT_FOUND;
      const message = errors.purchaseCar.noSearchCars;
      throw new ApiError(statusCode, message);
    }

    const results = await PurchaseCar.aggregate([{ $match: match }]);
    const count = results.length;

    // Clear phone number for sold cars
    purchaseCars = purchaseCars.map((car) => ({
      ...car,
      phoneNumber: car.sold ? "" : car.phoneNumber,
    }));

    return {
      purchaseCars,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
    };
  } catch (err) {
    throw err;
  }
};

module.exports.getMyPurchaseCars = async (user, page, limit) => {
  try {
    page = parseInt(page);
    limit = parseInt(limit);

    const purchaseCars = await PurchaseCar.find({ "owner.ref": user._id })
      .sort({ _id: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    if (!purchaseCars || !purchaseCars.length) {
      const statusCode = httpStatus.NOT_FOUND;
      const message = errors.purchaseCar.noPostedCars;
      throw new ApiError(statusCode, message);
    }

    const count = await PurchaseCar.count({ "owner.ref": user._id });

    return {
      purchaseCars,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
    };
  } catch (err) {
    throw err;
  }
};

module.exports.addPurchaseCar = async (
  user,
  carName,
  vin,
  model,
  brandId,
  year,
  colorEN,
  colorAR,
  trimLevel,
  vehicleTypeEN,
  vehicleTypeAR,
  fuelTypeEN,
  fuelTypeAR,
  noOfSeats,
  kiloPerHour,
  price,
  phoneICC,
  phoneNSN,
  description,
  photo1,
  photo2,
  photo3,
  photo4,
  photo5,
  photo6
) => {
  const photos = [];

  try {
    const brand = await brandsService.getBrand(brandId);

    const purchaseCar = new PurchaseCar({
      owner: {
        name: user.name,
        ref: user._id,
      },
      name: carName,
      vin,
      model,
      brand: {
        name: {
          en: brand.name.en,
          ar: brand.name.ar,
        },
        ref: brand._id,
      },
      year,
      color: {
        en: colorEN,
        ar: colorAR,
      },
      trimLevel,
      vehicleType: {
        en: vehicleTypeEN,
        ar: vehicleTypeAR,
      },
      fuelType: {
        en: fuelTypeEN,
        ar: fuelTypeAR,
      },
      noOfSeats,
      kiloPerHour,
      price,
      phoneNumber: `${phoneICC}${phoneNSN}`,
      description,
    });

    if (photo1) {
      const localPhoto = await localStorage.storeFile(photo1);
      photos.push(localPhoto);
      const cloudPhoto = await cloudStorage.uploadFile(localPhoto);
      await localStorage.deleteFile(localPhoto.path);
      purchaseCar.photos.push(cloudPhoto);
    }

    if (photo2) {
      const localPhoto = await localStorage.storeFile(photo2);
      photos.push(localPhoto);
      const cloudPhoto = await cloudStorage.uploadFile(localPhoto);
      await localStorage.deleteFile(localPhoto.path);
      purchaseCar.photos.push(cloudPhoto);
    }

    if (photo3) {
      const localPhoto = await localStorage.storeFile(photo3);
      photos.push(localPhoto);
      const cloudPhoto = await cloudStorage.uploadFile(localPhoto);
      await localStorage.deleteFile(localPhoto.path);
      purchaseCar.photos.push(cloudPhoto);
    }

    if (photo4) {
      const localPhoto = await localStorage.storeFile(photo4);
      photos.push(localPhoto);
      const cloudPhoto = await cloudStorage.uploadFile(localPhoto);
      await localStorage.deleteFile(localPhoto.path);
      purchaseCar.photos.push(cloudPhoto);
    }

    if (photo5) {
      const localPhoto = await localStorage.storeFile(photo5);
      photos.push(localPhoto);
      const cloudPhoto = await cloudStorage.uploadFile(localPhoto);
      await localStorage.deleteFile(localPhoto.path);
      purchaseCar.photos.push(cloudPhoto);
    }

    if (photo6) {
      const localPhoto = await localStorage.storeFile(photo6);
      photos.push(localPhoto);
      const cloudPhoto = await cloudStorage.uploadFile(localPhoto);
      await localStorage.deleteFile(localPhoto.path);
      purchaseCar.photos.push(cloudPhoto);
    }

    await purchaseCar.save();

    brand.noOfCars.purchase = brand.noOfCars.purchase + 1;
    await brand.save();

    // TODO: check for payment

    return purchaseCar;
  } catch (err) {
    if (photos.length) {
      photos.forEach(async (photo) => {
        await localStorage.deleteFile(photo.path);
      });
    }

    throw err;
  }
};

module.exports.markPurchaseCarAsSold = async (purchaseCarId) => {
  try {
    // Check if purchase car exists
    const purchaseCar = await PurchaseCar.findById(purchaseCarId);
    if (!purchaseCar) {
      const statusCode = httpStatus.NOT_FOUND;
      const message = errors.purchaseCar.notFound;
      throw new ApiError(statusCode, message);
    }

    // Check if purchase car is already sold
    if (purchaseCar.isSold()) {
      const statusCode = httpStatus.BAD_REQUEST;
      const message = errors.purchaseCar.alreadySold;
      throw new ApiError(statusCode, message);
    }

    // Mark purchase car as sold
    purchaseCar.markAsSold();

    // Save purchase car to the DB
    await purchaseCar.save();

    return purchaseCar;
  } catch (err) {
    throw err;
  }
};
