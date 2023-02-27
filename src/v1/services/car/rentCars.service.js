const { RentCar } = require("../../models/car/rentCar.model");
const { RentOrder } = require("../../models/car/rentOrder.model");
const brandsService = require("./brands.service");
const localStorage = require("../../services/storage/localStorage.service");
const cloudStorage = require("../../services/cloud/cloudStorage.service");
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
module.exports.getAllRentCars = async (page, limit) => {
  try {
    page = parseInt(page);
    limit = parseInt(limit);

    const rentCars = await RentCar.find({ accepted: true, archived: false })
      .sort({ _id: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    if (!rentCars || !rentCars.length) {
      const statusCode = httpStatus.NOT_FOUND;
      const message = errors.rentCar.noCars;
      throw new ApiError(statusCode, message);
    }

    const count = await RentCar.count({ accepted: true, archived: false });

    return {
      rentCars,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
    };
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
      {
        $match: {
          $text: { $search: searchTerm },
          accepted: true,
          archived: false,
        },
      },
      { $sort: { score: { $meta: "textScore" } } },
      { $limit: 10 },
    ]);

    // if (!rentCars || !rentCars.length) {
    //   rentCars = await RentCar.find({ accepted: true })
    //     .sort({ _id: -1 })
    //     .limit(10);
    // }

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

module.exports.searchRentCars = async (
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
      accepted: true,
      archived: false,
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

    let rentCars = await RentCar.aggregate([
      { $match: match },
      { $sort: { score: { $meta: "textScore" } } },
      { $skip: (page - 1) * limit },
      { $limit: limit },
    ]);

    if (!rentCars || !rentCars.length) {
      const statusCode = httpStatus.NOT_FOUND;
      const message = errors.rentCar.noSearchCars;
      throw new ApiError(statusCode, message);
    }

    const results = await RentCar.aggregate([{ $match: match }]);
    const count = results.length;

    return {
      rentCars,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
    };
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
    // Check if rent car exists
    const rentCar = await RentCar.findById(rentCarId);
    if (!rentCar) {
      const statusCode = httpStatus.NOT_FOUND;
      const message = errors.rentCar.notFound;
      throw new ApiError(statusCode, message);
    }

    // Check if the user is car's owner
    if (rentCar.office.ref.toString() === user._id.toString()) {
      const statusCode = httpStatus.FORBIDDEN;
      const message = errors.rentCar.requestOwnRentCar;
      throw new ApiError(statusCode, message);
    }

    // Check if car is accepted
    if (!rentCar.accepted) {
      const statusCode = httpStatus.FORBIDDEN;
      const message = errors.rentCar.requestNotAcceptedCar;
      throw new ApiError(statusCode, message);
    }

    // Check if car is archived
    if (rentCar.isArchived()) {
      const statusCode = httpStatus.FORBIDDEN;
      const message = errors.rentCar.requestArchivedCar;
      throw new ApiError(statusCode, message);
    }

    // Check if user has requested the same car and didn't receive it
    const carOrders = await RentOrder.find({
      author: user._id,
      rentCar: rentCar._id,
    });
    const hasUndeliveredOrderForThisCar =
      carOrders.findIndex((order) => !order.isDelivered()) >= 0;
    if (hasUndeliveredOrderForThisCar) {
      const statusCode = httpStatus.FORBIDDEN;
      const message = errors.rentCar.requestCarTwice;
      throw new ApiError(statusCode, message);
    }

    const order = new RentOrder({
      author: user._id,
      office: rentCar.office.ref,
      rentCar: rentCar._id,
      fullName,
      startDate,
      noOfDays,
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

    // Check if there's an order and its delivery days
    // matches or are in another order's days
    const rentOrdersForThisCar = await RentOrder.find({
      rentCar: rentCar._id,
      status: { $not: { $in: ["rejected", "closed", "delivered"] } },
    });
    for (let thisOrder of rentOrdersForThisCar) {
      if (thisOrder.conflictsWith(order)) {
        const statusCode = httpStatus.FORBIDDEN;
        const message = errors.rentCar.orderTimeConflict;
        throw new ApiError(statusCode, message);
      }
    }

    await order.save();

    // TODO: check for payment

    return { order, rentCar };
  } catch (err) {
    throw err;
  }
};

//////////////////// Office Services ////////////////////
module.exports.getMyRentCars = async (office, page, limit) => {
  try {
    page = parseInt(page);
    limit = parseInt(limit);

    const rentCars = await RentCar.find({ "office.ref": office._id })
      .sort({ _id: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    if (!rentCars || !rentCars.length) {
      const statusCode = httpStatus.NOT_FOUND;
      const message = errors.rentCar.noPostedCars;
      throw new ApiError(statusCode, message);
    }

    const count = await RentCar.count({ "office.ref": office._id });

    return {
      rentCars,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
    };
  } catch (err) {
    throw err;
  }
};

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
      const localPhoto = await localStorage.storeFile(photo1);
      const cloudPhoto = await cloudStorage.uploadFile(localPhoto);
      await localStorage.deleteFile(localPhoto.path);
      rentCar.photos.push(cloudPhoto);
    }

    if (photo2) {
      const localPhoto = await localStorage.storeFile(photo2);
      const cloudPhoto = await cloudStorage.uploadFile(localPhoto);
      await localStorage.deleteFile(localPhoto.path);
      rentCar.photos.push(cloudPhoto);
    }

    if (photo3) {
      const localPhoto = await localStorage.storeFile(photo3);
      const cloudPhoto = await cloudStorage.uploadFile(localPhoto);
      await localStorage.deleteFile(localPhoto.path);
      rentCar.photos.push(cloudPhoto);
    }

    if (photo4) {
      const localPhoto = await localStorage.storeFile(photo4);
      const cloudPhoto = await cloudStorage.uploadFile(localPhoto);
      await localStorage.deleteFile(localPhoto.path);
      rentCar.photos.push(cloudPhoto);
    }

    if (photo5) {
      const localPhoto = await localStorage.storeFile(photo5);
      const cloudPhoto = await cloudStorage.uploadFile(localPhoto);
      await localStorage.deleteFile(localPhoto.path);
      rentCar.photos.push(cloudPhoto);
    }

    if (photo6) {
      const localPhoto = await localStorage.storeFile(photo6);
      const cloudPhoto = await cloudStorage.uploadFile(localPhoto);
      await localStorage.deleteFile(localPhoto.path);
      rentCar.photos.push(cloudPhoto);
    }

    await rentCar.save();

    brand.noOfCars.rental = brand.noOfCars.rental + 1;
    await brand.save();

    return rentCar;
  } catch (err) {
    throw err;
  }
};

module.exports.archiveRentCar = async (rentCarId) => {
  try {
    // Check if car exists
    const rentCar = await RentCar.findById(rentCarId);
    if (!rentCar) {
      const statusCode = httpStatus.NOT_FOUND;
      const message = errors.rentCar.notFound;
      throw new ApiError(statusCode, message);
    }

    // Check if car is already archived
    if (rentCar.isArchived()) {
      const statusCode = httpStatus.BAD_REQUEST;
      const message = errors.rentCar.alreadyArchived;
      throw new ApiError(statusCode, message);
    }

    // Archive car
    rentCar.archive();

    // Save car to the DB
    await rentCar.save();

    return rentCar;
  } catch (err) {
    throw err;
  }
};

module.exports.restoreRentCar = async (rentCarId) => {
  try {
    // Check if car exists
    const rentCar = await RentCar.findById(rentCarId);
    if (!rentCar) {
      const statusCode = httpStatus.NOT_FOUND;
      const message = errors.rentCar.notFound;
      throw new ApiError(statusCode, message);
    }

    // Check if car is not archived
    if (!rentCar.isArchived()) {
      const statusCode = httpStatus.BAD_REQUEST;
      const message = errors.rentCar.alreadyArchived;
      throw new ApiError(statusCode, message);
    }

    // Archive car
    rentCar.restore();

    // Save car to the DB
    await rentCar.save();

    return rentCar;
  } catch (err) {
    throw err;
  }
};

module.exports.deleteRentCar = async (rentCarId) => {
  try {
    // Check if car exists
    const rentCar = await RentCar.findById(rentCarId);
    if (!rentCar) {
      const statusCode = httpStatus.NOT_FOUND;
      const message = errors.rentCar.notFound;
      throw new ApiError(statusCode, message);
    }

    // Check if car is accepted
    if (rentCar.isAccepted()) {
      const statusCode = httpStatus.FORBIDDEN;
      const message = errors.rentCar.deleteAcceptedCar;
      throw new ApiError(statusCode, message);
    }

    // Delete rent car
    await rentCar.delete();

    return rentCar;
  } catch (err) {
    throw err;
  }
};

//////////////////// Admin Services ////////////////////
module.exports.getNotAcceptedRentCars = async (page, limit) => {
  try {
    page = parseInt(page);
    limit = parseInt(limit);

    const rentCars = await RentCar.find({ accepted: false })
      .sort({ _id: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    if (!rentCars || !rentCars.length) {
      const statusCode = httpStatus.NOT_FOUND;
      const message = errors.rentCar.noNotAcceptedCars;
      throw new ApiError(statusCode, message);
    }

    const count = await RentCar.count({ accepted: false });

    return {
      rentCars,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
    };
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
