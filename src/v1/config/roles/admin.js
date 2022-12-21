const { allRights } = require("./common");

module.exports = Object.freeze({
  user: allRights,
  emailVerificationCode: allRights,
  phoneVerificationCode: allRights,
  password: allRights,
  notification: allRights,
  favorites: allRights,
  purchaseCar: allRights,
  rentCar: allRights,
  rentOrder: allRights,
  order: allRights,
});
