const Notificatin = require("./Notification");

module.exports = {
  postAddedForAdmin: (photoURL, purchaseCarId) =>
    new Notificatin(
      "New purchase car has been posted to app",
      "تم نشر سيّارة للبيع جديدة الآن",
      "There is a new purchase car has been posted to app",
      "يوجد هناك سيّارة للبيع جديدة تم نشرها الآن داخل التطبيق",
      photoURL,
      "purchaseCarDetails",
      purchaseCarId
    ),
  postAddedForUser: (photoURL, purchaseCarId) =>
    new Notificatin(
      "Car has been posted successfully",
      "تم نشر السيّارة بنجاح",
      "Your car has been successfully posted and is now offered for sale within the app",
      "تم نشر سيّارتك بنجاح وهي معروضة الآن للبيع داخل التطبيق",
      photoURL,
      "purchaseCarDetails",
      purchaseCarId
    ),
};
