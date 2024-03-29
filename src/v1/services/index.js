module.exports.authService = require("./user/auth.service");
module.exports.usersService = require("./user/users.service");
module.exports.googleService = require("./user/google.service");
module.exports.transactionsService = require("./user/transactions.service");
module.exports.pricesService = require("./user/prices.service");

module.exports.excelService = require("./storage/excel.service");
module.exports.localStorage = require("./storage/localStorage.service");

module.exports.rentCarsService = require("./car/rentCars.service");
module.exports.purchaseCarsService = require("./car/purchaseCars.service");
module.exports.brandsService = require("./car/brands.service");
module.exports.rentOrdersService = require("./car/rentOrders.service");

module.exports.notificationsService = require("./cloud/notifications.service");
module.exports.emailService = require("./cloud/email.service");
module.exports.cloudStorage = require("./cloud/cloudStorage.service");

module.exports.scheduleService = require("./system/schedule.service");

module.exports.fatoraService = require("./payment/fatora.service");
module.exports.paypalService = require("./payment/paypal.service");
