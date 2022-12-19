const { RentCar } = require("../../models/car/rentCar.model");

module.exports.getAllCars = async (skip) => {
  try {
    return await RentCar.find({}).sort({ _id: -1 }).limit(10).skip(skip);
  } catch (err) {
    throw err;
  }
};
