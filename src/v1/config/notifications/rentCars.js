const Notificatin = require("./Notification");

module.exports = {
  postAdded: (photoURL) =>
    new Notificatin(
      "طلب نشر سيّارة للإيجار",
      "يوجد هناك طلب نشر سيّارة للإيجار جديد تفحّصه",
      {},
      photoURL
    ),
  postRejected: (body, photoURL) =>
    new Notificatin("طلب نشر سيّارة للإيجار", body, {}, photoURL),
  postAccepted: (photoURL) =>
    new Notificatin("طلب نشر سيّارة للإيجار", "تم قبول طلبك", {}, photoURL),
  rentalRequestForAdmin: (photoURL) =>
    new Notificatin(
      "طلب إستئجار سيّارة جديد",
      "هناك طلب إستئجار سيّارة جديد وهو قيد المراجعة من طرف مكتب التأجير الآن",
      {},
      photoURL
    ),
  rentalRequestForOffice: (photoURL) =>
    new Notificatin(
      "طلب إستئجار سيّارة جديد",
      "لقد وصلك طلب إستئجار سيّارة جديد يرجى مراجعته والرد عليه",
      {},
      photoURL
    ),
  rentalRequestForUser: (photoURL) =>
    new Notificatin(
      "تم إرسال طلبك بنجاح",
      "تم إرسال طلبك إلى مكتب التأجير وهو قيد المراجعة الآن",
      {},
      photoURL
    ),
  rentalRequestApprovedForAdmin: (photoURL) =>
    new Notificatin(
      "تم قبول طلب إستئجار",
      "هناك طلب إستئجار سيّارة تم قبولة من طرف مكتب التأجير الآن وهو بإنتظار الدفع من طرف المستأجر",
      {},
      photoURL
    ),
  rentalRequestApprovedForOffice: (photoURL) =>
    new Notificatin(
      "تم قبول طلب إستئجار",
      "لقد قمت بقبول طلب التأجير وهو الآن بإنتظار الدفع من قبل المستأجر قبل التسليم",
      {},
      photoURL
    ),
  rentalRequestApprovedForUser: (photoURL) =>
    new Notificatin(
      "تم قبول طلب إستئجار",
      "تم قبول طلب إستئجار سيّارة من طرف مكتب التأجير يرجى الدفع لإستلام طلبك",
      {},
      photoURL
    ),
  rentalRequestPaidForAdmin: (photoURL) =>
    new Notificatin(
      "تم دفع رسوم التأجير من مستأجر",
      "هناك طلب إستئجار سيّارة تم دفعه من طرف المستأجر وهو الآن بإنتظار التسليم من طرف مكتب التأجير",
      {},
      photoURL
    ),
  rentalRequestPaidForOffice: (photoURL) =>
    new Notificatin(
      "تم دفع رسوم التأجير من مستأجر",
      "هناك طلب إستئجار سيّارة تم دفعه من طرف المستأجر يرجى التوجه إلى إجراءات التسليم لتسليم السيّارة للمستأجر",
      {},
      photoURL
    ),
  rentalRequestPaidForUser: (photoURL) =>
    new Notificatin(
      "تم دفع رسوم تأجير السيّارة بنجاح",
      "إجراء طلبك إكتمل وسيتم تسليمك السيّارة في المدة المحددة",
      {},
      photoURL
    ),
  rentalRequestRejectedForAdmin: (body, photoURL) =>
    new Notificatin(
      "تم رفض طلب إستئجار سيّارة من طرف مكتب تأجير",
      body,
      {},
      photoURL
    ),
  rentalRequestRejectedForOffice: (body, photoURL) =>
    new Notificatin(
      "تم رفض طلب إستئجار السيّارة وإبلاغ المستخدم بسبب الرفض",
      body,
      {},
      photoURL
    ),
  rentalRequestRejectedForUser: (body, photoURL) =>
    new Notificatin(
      "تم رفض طلب إستئجار السيّارة الذي أرسلته",
      body,
      {},
      photoURL
    ),
  transactionNotificationIncomplete: () =>
    new Notificatin(
      "لديك معاملة ماليّة جديدة بإنتظار الدفع",
      "لديك معاملة ماليّة جديدة يرجى مراجعة سجل المعاملات الماليّة"
    ),
  transactionNotificationComplete: () =>
    new Notificatin(
      "تم إكمال معاملتك الماليّة بنجاح",
      "بإمكانك مراجعة سجل المعاملات الماليّة والتأكد من صحة الإكتمال"
    ),
};
