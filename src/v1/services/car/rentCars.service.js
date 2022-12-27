const { RentCar } = require("../../models/car/rentCar.model");
const { brandsService } = require("../../services");
const localStorage = require("../../services/storage/localStorage.service");
const { ApiError } = require("../../middleware/apiError");
const httpStatus = require("http-status");
const errors = require("../../config/errors");

//////////////////// User Services ////////////////////
module.exports.getAllRentCars = async (skip) => {
  try {
    const rentCars = await RentCar.find({})
      .sort({ _id: -1 })
      .skip(skip)
      .limit(10);
    if (!rentCars || !rentCars.length) {
      const statusCode = httpStatus.NOT_FOUND;
      const message = errors.rentCar.noCars;
      throw new ApiError(statusCode, message);
    }

    return rentCars;
  } catch (err) {
    throw err;
  }
};

module.exports.getRentCarDetails = async (carId) => {
  try {
    const rentCar = await RentCar.findById(carId);
    if (!rentCar) {
      const statusCode = httpStatus.NOT_FOUND;
      const message = errors.rentCar.notFound;
      throw new ApiError(statusCode, message);
    }

    return rentCar;
  } catch (err) {
    throw err;
  }
};

module.exports.getSimilarRentCars = async (
  name,
  model,
  brandEN,
  brandAR,
  colorEN,
  colorAR,
  year,
  description
) => {
  try {
    const searchTerm = `${name} ${model} ${brandEN} ${brandAR} ${colorEN} ${colorAR} ${year} ${description}`;

    let rentCars = await RentCar.aggregate([
      { $match: { $text: { $search: searchTerm } } },
      { $sort: { score: { $meta: "textScore" } } },
      { $limit: 10 },
    ]);

    if (!rentCars || !rentCars.length) {
      rentCars = await RentCar.find({}).sort({ _id: -1 }).limit(10);
    }

    if (!rentCars || !rentCars.length) {
      const statusCode = httpStatus.NOT_FOUND;
      const message = errors.rentCar.noSimilarCars;
      throw new ApiError(statusCode, message);
    }

    return rentCars;
  } catch (err) {
    throw err;
  }
};

module.exports.searchRentCars = async (searchTerm, skip) => {
  try {
    let rentCars = await RentCar.aggregate([
      { $match: { $text: { $search: searchTerm } } },
      { $sort: { score: { $meta: "textScore" } } },
      { $skip: parseInt(skip) },
      { $limit: 10 },
    ]);

    if (!rentCars || !rentCars.length) {
      rentCars = await RentCar.find({}).sort({ _id: -1 }).limit(10);
    }

    if (!rentCars || !rentCars.length) {
      const statusCode = httpStatus.NOT_FOUND;
      const message = errors.rentCar.noSearchCars;
      throw new ApiError(statusCode, message);
    }

    return rentCars;
  } catch (err) {
    throw err;
  }
};

// TODO: complete this after completing order apis
module.exports.requestCarRental = async (
  user,
  rentCarId,
  startDate,
  noOfDays,
  location,
  fullName,
  phoneNumber
) => {
  try {
    const rentCar = await RentCar.findById(rentCarId);
    if (!rentCar) {
      const statusCode = httpStatus.NOT_FOUND;
      const message = errors.rentCar.notFound;
      throw new ApiError(statusCode, message);
    }
  } catch (err) {
    throw err;
  }
};

//////////////////// User Services ////////////////////
module.exports.getMyCars = async (user, skip) => {
  try {
    const myCars = await RentCar.find({ "office.ref": user._id })
      .sort({ _id: -1 })
      .skip(skip)
      .limit(10);

    if (!myCars || !myCars.length) {
      const statusCode = httpStatus.NOT_FOUND;
      const message = errors.rentCar.noPostedCars;
      throw new ApiError(statusCode, message);
    }

    return myCars;
  } catch (err) {
    throw err;
  }
};

// TODO: complete this after completing brand apis
module.exports.addRentCar = async (
  user,
  carName,
  model,
  colorEN,
  colorAR,
  brandId,
  year,
  dailyPrice,
  weeklyPrice,
  monthlyPrice,
  deposit,
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

    const rentCar = new RentCar({
      office: {
        name: user.name,
        ref: user._id,
      },
      name: carName,
      model,
      color: {
        en: colorEN,
        ar: colorAR,
      },
      brand: {
        name: {
          en: brand.name.en,
          ar: brand.name.ar,
        },
        ref: brand._id,
      },
      year,
      price: {
        daily: dailyPrice,
        weekly: weeklyPrice,
        monthly: monthlyPrice,
        deposit,
      },
      description,
    });

    if (photo1) {
      const photo = await localStorage.storeFile(photo1);
      rentCar.photos.push(photo.path);
    }

    if (photo2) {
      const photo = await localStorage.storeFile(photo2);
      rentCar.photos.push(photo.path);
    }

    if (photo3) {
      const photo = await localStorage.storeFile(photo3);
      rentCar.photos.push(photo.path);
    }

    if (photo4) {
      const photo = await localStorage.storeFile(photo4);
      rentCar.photos.push(photo.path);
    }

    if (photo5) {
      const photo = await localStorage.storeFile(photo5);
      rentCar.photos.push(photo.path);
    }

    if (photo6) {
      const photo = await localStorage.storeFile(photo6);
      rentCar.photos.push(photo.path);
    }

    await rentCar.save();

    brand.noOfCars.rental = brand.noOfCars.rental + 1;
    await brand.save();

    return rentCar;
  } catch (err) {
    throw err;
  }
};
