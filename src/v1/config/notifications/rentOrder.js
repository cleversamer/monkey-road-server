const Notificatin = require("./Notification");

module.exports = {
  orderClosedForUser: (photoURL) =>
    new Notificatin(
      "Order has been closed successfully",
      "تم إغلاق الطلب بنجاح",
      "Your order has been closed successfully and is now invisible to the office that owns the car",
      "تم إغلاق طلبك بنجاح وهو الآن غير مرئي لمكتب التأجير المالك للسيّارة",
      photoURL
    ),
  orderDeletedForUser: (photoURL) =>
    new Notificatin(
      "Order has been successfully deleted",
      "تم حذف الطلب بنجاح",
      "Your order has been successfully deleted and is now invisible to the office that owns the car",
      "تم حذف طلبك بنجاح وهو الآن غير مرئي لمكتب التأجير المالك للسيّارة",
      photoURL
    ),
};
