const Notificatin = require("./Notification");

module.exports = {
  paymentDeliveredForAdmin: (amount) =>
    new Notificatin(
      `تم تأكيد تسليم دفعة ماليّة بمبلغ ${amount} درهم إماراتي لمكتب التأجير`,
      `تم تأكيد تسليم دفعة مالية لمكتب التأجير وخصم المبلغ من رصيد حسابه لدينا`
    ),
  paymentDeliveredForOffice: (amount) =>
    new Notificatin(
      `تم تأكيد إستلامك لدفعة ماليّة بمبلغ ${amount} درهم إماراتي`,
      `تم تأكيد إستلامك للدفعة المالية وخصم المبلغ من رصيد حسابك لدينا`
    ),
  missedIncompleteTransaction: new Notificatin(
    "لديك معاملات ماليّة غير مكتملة",
    "يرجى مراجعة سجل المعاملات الماليّة بانتظام وإكمال المعاملات الماليّة بأسرع وقت"
  ),
};
