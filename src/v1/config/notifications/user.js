const Notificatin = require("./Notification");

module.exports = {
  paymentDeliveredForAdmin: (amount, officeEmail) =>
    new Notificatin(
      `A payment of ${amount.toLocaleString()} AED has been confirmed to the rental office`,
      `تم تأكيد تسليم دفعة ماليّة بمبلغ ${amount.toLocaleString()} درهم إماراتي لمكتب التأجير`,
      "A payment has been confirmed to the office and the amount has been deducted from their account balance with us",
      "تم تأكيد تسليم دفعة مالية لمكتب التأجير وخصم المبلغ من رصيد حسابه لدينا",
      "",
      "searchOffices",
      officeEmail
    ),
  paymentDeliveredForOffice: (amount) =>
    new Notificatin(
      `You are confirmed to have received a payment of ${amount.toLocaleString()} AED`,
      `تم تأكيد استلامك لدفعة ماليّة بمبلغ ${amount.toLocaleString()} درهم إماراتي`,
      "Your payment has been confirmed and the amount has been deducted from your account balance with us",
      "تم تأكيد استلامك للدفعة المالية وخصم المبلغ من رصيد حسابك لدينا",
      "",
      "myTransactions"
    ),
  missedIncompleteTransaction: () =>
    new Notificatin(
      "You have incomplete transactions",
      "لديك معاملات ماليّة غير مكتملة",
      "Please review and complete your transactions regularly as soon as possible",
      "يرجى مراجعة سجل المعاملات الماليّة بانتظام وإكمال المعاملات الماليّة بأسرع وقت",
      "",
      "myTransactions"
    ),
};
