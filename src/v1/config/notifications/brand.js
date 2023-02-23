const Notificatin = require("./Notification");

module.exports = {
  brandAddedForAdmin: (name, photoURL) =>
    new Notificatin(
      `Brand \'${name.en}\' has been added successfully`,
      `تم إضافة شركة السيّارات ${name.ar} بنجاح`,
      `Brand \'${name.en}\' has been added successfully and users has been notified`,
      `تم إضافة شركة السيّارات \'${name.ar}\' إلى النظام وإعلان كافّة المستخدمين بنجاح`,
      photoURL,
      "popularBrands"
    ),
  brandAddedForAllUsers: (name, photoURL) =>
    new Notificatin(
      `New brand \'${name.en}\' has been added to app`,
      `تم إضافة شركة سيّارات جديدة من نوع \'${name.ar}\'`,
      `New brand \'${name.en}\' has been added to app, and now you can post cars with this brand`,
      `تم إضافة شركة سيّارات جديدة للتطبيق من نوع ${name.ar}، بإمكانك إضافة سيّارات جديدة من هذا النوع الآن`,
      photoURL,
      "popularBrands"
    ),
};
