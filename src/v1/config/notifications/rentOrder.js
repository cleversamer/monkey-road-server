const Notificatin = require("./Notification");

module.exports = {
  orderClosedForUser: (photoURL) =>
    new Notificatin(
      `تم إغلاق الطلب بنجاح`,
      `تم إغلاق طلبك بنجاح وهو الآن غير مرئي لمكتب التأجير المالك للسيّارة`,
      photoURL
    ),
  orderDeletedForUser: (photoURL) =>
    new Notificatin(
      `تم حذف الطلب بنجاح`,
      `تم حذف طلبك بنجاح وهو الآن غير مرئي لمكتب التأجير المالك للسيّارة`,
      photoURL
    ),
};
