const { RentCar } = require("../../models/car/rentCar.model");
const { Order, RentOrder } = require("../../models/car/rentOrder.model");
const brandsService = require("./brands.service");
const localStorage = require("../../services/storage/localStorage.service");
const { ApiError } = require("../../middleware/apiError");
const httpStatus = require("http-status");
const errors = require("../../config/errors");

//////////////////// Internal Services ////////////////////
module.exports.getRentCarsStatus = async () => {
  try {
    const rentCars = await RentCar.find({});

    const totalCount = rentCars.length;

    const inactiveCarsCount = rentCars.filter(
      (rentCar) => !rentCar.accepted
    ).length;

    return {
      total: totalCount,
      inactive: inactiveCarsCount,
    };
  } catch (err) {
    throw err;
  }
};

//////////////////// User Services ////////////////////
module.exports.getAllRentCars = async (skip) => {
  try {
    const rentCars = await RentCar.find({ accepted: true })
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

    if (!rentCar || !rentCar.accepted) {
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
  carId,
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
      { $match: { $text: { $search: searchTerm }, accepted: true } },
      { $sort: { score: { $meta: "textScore" } } },
      { $limit: 10 },
    ]);

    if (!rentCars || !rentCars.length) {
      rentCars = await RentCar.find({ accepted: true })
        .sort({ _id: -1 })
        .limit(10);
    }

    rentCars = rentCars.filter(
      (car) => car._id.toString() !== carId.toString()
    );

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
      { $match: { $text: { $search: searchTerm }, accepted: true } },
      { $sort: { score: { $meta: "textScore" } } },
      { $skip: parseInt(skip) },
      { $limit: 10 },
    ]);

    if (!rentCars || !rentCars.length) {
      rentCars = await RentCar.find({ accepted: true })
        .sort({ _id: -1 })
        .limit(10);
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

module.exports.requestCarRental = async (
  user,
  rentCarId,
  startDate,
  noOfDays,
  locationTitle,
  longitude,
  latitude,
  fullName,
  phoneICC,
  phoneNSN
) => {
  try {
    const rentCar = await RentCar.findById(rentCarId);

    if (!rentCar || !rentCar.accepted) {
      const statusCode = httpStatus.NOT_FOUND;
      const message = errors.rentCar.notFound;
      throw new ApiError(statusCode, message);
    }

    const order = new RentOrder({
      author: user._id,
      office: rentCar.office.ref,
      rentCar: rentCar._id,
      fullName,
      startDate,
      phoneNumber: {
        full: `${phoneICC}${phoneNSN}`,
        icc: phoneICC,
        nsn: phoneNSN,
      },
      receptionLocation: {
        title: locationTitle,
        longitude,
        latitude,
      },
    });

    order.calcTotalPrice(noOfDays, rentCar.price);
    order.setEndDate(noOfDays);

    await order.save();

    return order;
  } catch (err) {
    throw err;
  }
};

//////////////////// Office Services ////////////////////
module.exports.getMyRentCars = async (office, skip) => {
  try {
    const myCars = await RentCar.find({ "office.ref": office._id })
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

//////////////////// Admin Services ////////////////////
module.exports.getNotAcceptedRentCars = async (skip) => {
  try {
    const rentCars = await RentCar.find({ accepted: false })
      .sort({ _id: -1 })
      .skip(skip)
      .limit(10);

    if (!rentCars || !rentCars.length) {
      const statusCode = httpStatus.NOT_FOUND;
      const message = errors.rentCar.noNotAcceptedCars;
      throw new ApiError(statusCode, message);
    }

    return rentCars;
  } catch (err) {
    throw err;
  }
};

module.exports.acceptRentCar = async (carId) => {
  try {
    const rentCar = await RentCar.findById(carId);

    // Check if rent car exists
    if (!rentCar) {
      const statusCode = httpStatus.NOT_FOUND;
      const message = errors.rentCar.notFound;
      throw new ApiError(statusCode, message);
    }

    // Check if rent car is already accepted
    if (rentCar.accepted) {
      const statusCode = httpStatus.NOT_FOUND;
      const message = errors.rentCar.alreadyAccepted;
      throw new ApiError(statusCode, message);
    }

    // Accept rent car
    rentCar.accept();

    // Save rent car to the DB
    await rentCar.save();

    return rentCar;
  } catch (err) {
    throw err;
  }
};

module.exports.rejectRentCar = async (carId) => {
  try {
    const rentCar = await RentCar.findByIdAndDelete(carId);

    // Check if rent car exists
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
