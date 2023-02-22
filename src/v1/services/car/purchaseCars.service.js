const { PurchaseCar } = require("../../models/car/purchaseCar.model");
const brandsService = require("./brands.service");
const localStorage = require("../../services/storage/localStorage.service");
const cloudStorage = require("../../services/cloud/cloudStorage.service");
const { ApiError } = require("../../middleware/apiError");
const httpStatus = require("http-status");
const errors = require("../../config/errors");

//////////////////// Internal Services ////////////////////
module.exports.findPurchaseCars = async (purchaseCarIds = []) => {
  try {
    const purchaseCars = await PurchaseCar.find({
      _id: { $in: purchaseCarIds },
    });

    return purchaseCars;
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

module.exports.getRecentlyArrivedPurchaseCars = async (skip) => {
  try {
    let purchaseCars = await PurchaseCar.find({})
      .sort({ _id: -1 })
      .skip(skip)
      .limit(10);

    // Check if there are no cars
    if (!purchaseCars || !purchaseCars.length) {
      const statusCode = httpStatus.NOT_FOUND;
      const message = errors.purchaseCar.noCars;
      throw new ApiError(statusCode, message);
    }

    // Clear phone number for sold cars
    purchaseCars = purchaseCars.map((car) => ({
      ...car,
      phoneNumber: car.isSold() ? "" : car.phoneNumber,
    }));

    return purchaseCars;
  } catch (err) {
    throw err;
  }
};

module.exports.getLatestModelsPurchaseCars = async (skip) => {
  try {
    let purchaseCars = await PurchaseCar.find({}).skip(skip).limit(10);

    // Check if there are no cars
    if (!purchaseCars || !purchaseCars.length) {
      const statusCode = httpStatus.NOT_FOUND;
      const message = errors.purchaseCar.noCars;
      throw new ApiError(statusCode, message);
    }

    // Clear phone number for sold cars
    purchaseCars = purchaseCars.map((car) => ({
      ...car,
      phoneNumber: car.isSold() ? "" : car.phoneNumber,
    }));

    return purchaseCars;
  } catch (err) {
    throw err;
  }
};

module.exports.getBestSellerPurchaseCars = async (skip) => {
  try {
    let purchaseCars = await PurchaseCar.find({})
      .sort({ model: 1 })
      .skip(skip)
      .limit(10);

    // Check if there are no cars
    if (!purchaseCars || !purchaseCars.length) {
      const statusCode = httpStatus.NOT_FOUND;
      const message = errors.purchaseCar.noCars;
      throw new ApiError(statusCode, message);
    }

    // Clear phone number for sold cars
    purchaseCars = purchaseCars.map((car) => ({
      ...car,
      phoneNumber: car.isSold() ? "" : car.phoneNumber,
    }));

    return purchaseCars;
  } catch (err) {
    throw err;
  }
};

module.exports.searchPurchaseCars = async (
  searchTerm,
  skip,
  minPrice,
  maxPrice,
  brands,
  colors,
  years
) => {
  try {
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
      { $skip: parseInt(skip) },
      { $limit: 10 },
    ]);

    // if (!purchaseCars || !purchaseCars.length) {
    //   purchaseCars = await PurchaseCar.find({})
    //     .sort({ _id: -1 })
    //     .skip(skip)
    //     .limit(10);
    // }

    // Check if there are no cars
    if (!purchaseCars || !purchaseCars.length) {
      const statusCode = httpStatus.NOT_FOUND;
      const message = errors.purchaseCar.noSearchCars;
      throw new ApiError(statusCode, message);
    }

    // Clear phone number for sold cars
    purchaseCars = purchaseCars.map((car) => ({
      ...car,
      phoneNumber: car.isSold() ? "" : car.phoneNumber,
    }));

    return purchaseCars;
  } catch (err) {
    throw err;
  }
};

module.exports.getMyPurchaseCars = async (user, skip) => {
  try {
    const myCars = await PurchaseCar.find({ "owner.ref": user._id })
      .sort({ _id: -1 })
      .skip(skip)
      .limit(10);

    if (!myCars || !myCars.length) {
      const statusCode = httpStatus.NOT_FOUND;
      const message = errors.purchaseCar.noPostedCars;
      throw new ApiError(statusCode, message);
    }

    return myCars;
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
      const cloudPhoto = await cloudStorage.uploadFile(localPhoto);
      await localStorage.deleteFile(localPhoto.path);
      purchaseCar.photos.push(cloudPhoto);
    }

    if (photo2) {
      const localPhoto = await localStorage.storeFile(photo2);
      const cloudPhoto = await cloudStorage.uploadFile(localPhoto);
      await localStorage.deleteFile(localPhoto.path);
      purchaseCar.photos.push(cloudPhoto);
    }

    if (photo3) {
      const localPhoto = await localStorage.storeFile(photo3);
      const cloudPhoto = await cloudStorage.uploadFile(localPhoto);
      await localStorage.deleteFile(localPhoto.path);
      purchaseCar.photos.push(cloudPhoto);
    }

    if (photo4) {
      const localPhoto = await localStorage.storeFile(photo4);
      const cloudPhoto = await cloudStorage.uploadFile(localPhoto);
      await localStorage.deleteFile(localPhoto.path);
      purchaseCar.photos.push(cloudPhoto);
    }

    if (photo5) {
      const localPhoto = await localStorage.storeFile(photo5);
      const cloudPhoto = await cloudStorage.uploadFile(localPhoto);
      await localStorage.deleteFile(localPhoto.path);
      purchaseCar.photos.push(cloudPhoto);
    }

    if (photo6) {
      const localPhoto = await localStorage.storeFile(photo6);
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
    throw err;
  }
};
