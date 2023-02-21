const Notificatin = require("./Notification");

module.exports = {
  brandAddedForAdmin: (nameAR, photoURL) =>
    new Notificatin(
      `تم إضافة شركة السيّارات ${nameAR} بنجاح`,
      `تم إضافة شركة السيّارات ${nameAR} إلى النظام وإعلان كافّة المستخدمين بنجاح`,
      photoURL
    ),
  brandAddedForAllUsers: (nameAR, photoURL) =>
    new Notificatin(
      `تم إضافة شركة سيّارات جديدة من نوع ${nameAR}`,
      `تم إضافة شركة سيّارات جديدة للتطبيق من نوع ${nameAR}، بإمكانك إضافة سيّارات جديدة من هذا النوع الآن`,
      photoURL
    ),
};
