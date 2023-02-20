const Notificatin = require("./Notification");

module.exports = {
  paymentDelivered: (amount) =>
    new Notificatin(
      `تم تأكيد إستلامك لدفعة ماليّة بمبلغ ${amount} درهم إماراتي`,
      `تم تأكيد إستلامك للدفعة المالية وخصم المبلغ من رصيد حسابك لدينا`
    ),
};
