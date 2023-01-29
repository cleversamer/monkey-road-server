const { PurchaseCar } = require("../../models/car/purchaseCar.model");
const brandsService = require("./brands.service");
const localStorage = require("../../services/storage/localStorage.service");
const { ApiError } = require("../../middleware/apiError");
const httpStatus = require("http-status");
const errors = require("../../config/errors");

//////////////////// Internal Services ////////////////////
module.exports.findPurchaseCars = async (purchaseCarIds = []) => {
  try {
    const purchaseCars = await PurchaseCar.aggregate([
      { $match: { _id: { $in: purchaseCarIds } } },
      {
        $lookup: {
          from: "Brand",
          localField: "brand.ref",
          foreignField: "_id",
          as: "brand",
        },
      },
      { $limit: purchaseCarIds.length },
    ]);

    return purchaseCars;
  } catch (err) {
    throw err;
  }
};

//////////////////// Routes Services ////////////////////
module.exports.getPurchaseCarDetails = async (carId) => {
  try {
    const purchaseCar = await PurchaseCar.findById(carId);

    if (!purchaseCar) {
      const statusCode = httpStatus.NOT_FOUND;
      const message = errors.purchaseCar.notFound;
      throw new ApiError(statusCode, message);
    }

    return purchaseCar;
  } catch (err) {
    throw err;
  }
};

module.exports.getRecentlyArrivedPurchaseCars = async (skip) => {
  try {
    const purchaseCars = await PurchaseCar.find({})
      .sort({ _id: -1 })
      .skip(skip)
      .limit(10);

    if (!purchaseCars || !purchaseCars.length) {
      const statusCode = httpStatus.NOT_FOUND;
      const message = errors.purchaseCar.noCars;
      throw new ApiError(statusCode, message);
    }

    return purchaseCars;
  } catch (err) {
    throw err;
  }
};

module.exports.getLatestModelsPurchaseCars = async (skip) => {
  try {
    const purchaseCars = await PurchaseCar.find({}).skip(skip).limit(10);

    if (!purchaseCars || !purchaseCars.length) {
      const statusCode = httpStatus.NOT_FOUND;
      const message = errors.purchaseCar.noCars;
      throw new ApiError(statusCode, message);
    }

    return purchaseCars;
  } catch (err) {
    throw err;
  }
};

module.exports.getBestSellerPurchaseCars = async (skip) => {
  try {
    const purchaseCars = await PurchaseCar.find({})
      .sort({ model: 1 })
      .skip(skip)
      .limit(10);

    if (!purchaseCars || !purchaseCars.length) {
      const statusCode = httpStatus.NOT_FOUND;
      const message = errors.purchaseCar.noCars;
      throw new ApiError(statusCode, message);
    }

    return purchaseCars;
  } catch (err) {
    throw err;
  }
};

module.exports.searchPurchaseCars = async (searchTerm, skip) => {
  try {
    let purchaseCars = await PurchaseCar.aggregate([
      { $match: { $text: { $search: searchTerm } } },
      { $sort: { score: { $meta: "textScore" } } },
      { $skip: parseInt(skip) },
      { $limit: 10 },
    ]);

    if (!purchaseCars || !purchaseCars.length) {
      purchaseCars = await PurchaseCar.find({})
        .sort({ _id: -1 })
        .skip(skip)
        .limit(10);
    }

    if (!purchaseCars || !purchaseCars.length) {
      const statusCode = httpStatus.NOT_FOUND;
      const message = errors.purchaseCar.noSearchCars;
      throw new ApiError(statusCode, message);
    }

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
  phoneNumber,
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
      phoneNumber,
      description,
    });

    if (photo1) {
      const photo = await localStorage.storeFile(photo1);
      purchaseCar.photos.push(photo.path);
    }

    if (photo2) {
      const photo = await localStorage.storeFile(photo2);
      purchaseCar.photos.push(photo.path);
    }

    if (photo3) {
      const photo = await localStorage.storeFile(photo3);
      purchaseCar.photos.push(photo.path);
    }

    if (photo4) {
      const photo = await localStorage.storeFile(photo4);
      purchaseCar.photos.push(photo.path);
    }

    if (photo5) {
      const photo = await localStorage.storeFile(photo5);
      purchaseCar.photos.push(photo.path);
    }

    if (photo6) {
      const photo = await localStorage.storeFile(photo6);
      purchaseCar.photos.push(photo.path);
    }

    // TODO: check for payment

    await purchaseCar.save();

    brand.noOfCars.purchase = brand.noOfCars.purchase + 1;
    await brand.save();

    return purchaseCar;
  } catch (err) {
    throw err;
  }
};
