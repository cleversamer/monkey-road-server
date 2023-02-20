const Notificatin = require("./Notification");

module.exports = {
  postAddedForAdmin: (photoURL) =>
    new Notificatin(
      "تم نشر سيّارة للبيع جديدة الآن",
      "يوجد هناك سيّارة للبيع جديدة تم نشرها الآن داخل التطبيق",
      photoURL
    ),
  postAddedForUser: (photoURL) =>
    new Notificatin(
      "تم نشر السيّارة بنجاح",
      "تم نشر سيّارتك بنجاح وهي معروضة الآن للبيع داخل التطبيق",
      photoURL
    ),
};
