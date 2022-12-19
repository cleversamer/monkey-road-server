const httpStatus = require("http-status");

module.exports.getAllCars = async (req, res, next) => {
  try {
    const { skip } = req.query;

    const cars = await rentCarsService.getAllCars(skip);

    res.status(httpStatus.OK).json({ cars });
  } catch (err) {
    next(err);
  }
};
