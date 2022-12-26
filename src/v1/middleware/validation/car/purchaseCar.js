const commonMiddleware = require("../common");

const getPurchaseCarDetailsValidator = [
  commonMiddleware.checkMongoIdParam,
  commonMiddleware.next,
];

module.exports = {
  getPurchaseCarDetailsValidator,
};
