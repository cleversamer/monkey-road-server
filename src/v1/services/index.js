module.exports.authService = require("./user/auth.service");
module.exports.usersService = require("./user/users.service");
module.exports.emailService = require("./user/email.service");
module.exports.googleService = require("./user/google.service");
module.exports.notificationsService = require("./user/notifications.service");

module.exports.cloudStorage = require("./storage/cloudStorage.service");
module.exports.excelService = require("./storage/excel.service");
module.exports.localStorage = require("./storage/localStorage.service");

module.exports.rentCarsService = require("./car/rentCars.service");
module.exports.purchaseCarsService = require("./car/purchaseCars.service");
module.exports.brandsService = require("./car/brands.service");
module.exports.rentOrdersService = require("./car/rentOrders.service");
