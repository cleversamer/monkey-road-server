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
  rentalRequestForAdmin: new Notificatin(
    "طلب إستئجار سيّارة جديد",
    "هناك طلب إستئجار سيّارة جديد وهو قيد المراجعة من طرف مكتب التأجير الآن"
  ),
  rentalRequestForOffice: new Notificatin(
    "طلب إستئجار سيّارة جديد",
    "لقد وصلك طلب إستئجار سيّارة جديد يرجى مراجعته والرد عليه"
  ),
  rentalRequestForUser: new Notificatin(
    "تم إرسال طلبك بنجاح",
    "تم إرسال طلبك إلى مكتب التأجير وهو قيد المراجعة الآن"
  ),
  rentalRequestApprovedForAdmin: new Notificatin(
    "تم قبول طلب إستئجار",
    "هناك طلب إستئجار سيّارة تم قبولة من طرف مكتب التأجير الآن وهو بإنتظار الدفع من طرف المستأجر"
  ),
  rentalRequestApprovedForOffice: new Notificatin(
    "تم قبول طلب إستئجار",
    "لقد قمت بقبول طلب التأجير وهو الآن بإنتظار الدفع من قبل المستأجر قبل التسليم"
  ),
  rentalRequestApprovedForUser: new Notificatin(
    "تم قبول طلب إستئجار",
    "تم قبول طلب إستئجار سيّارة من طرف مكتب التأجير يرجى الدفع لإستلام طلبك"
  ),
  rentalRequestPaidForAdmin: new Notificatin(
    "تم دفع رسوم التأجير من مستأجر",
    "هناك طلب إستئجار سيّارة تم دفعه من طرف المستأجر وهو الآن بإنتظار التسليم من طرف مكتب التأجير"
  ),
  rentalRequestPaidForOffice: new Notificatin(
    "تم دفع رسوم التأجير من مستأجر",
    "هناك طلب إستئجار سيّارة تم دفعه من طرف المستأجر يرجى التوجه إلى إجراءات التسليم لتسليم السيّارة للمستأجر"
  ),
  rentalRequestPaidForUser: new Notificatin(
    "تم دفع رسوم تأجير السيّارة بنجاح",
    "إجراء طلبك إكتمل وسيتم تسليمك السيّارة في المدة المحددة"
  ),
  rentalRequestRejectedForAdmin: new Notificatin(
    "تم رفض طلب إستئجار سيّارة من طرف مكتب تأجير",
    ""
  ),
  rentalRequestRejectedForOffice: new Notificatin(
    "تم رفض طلب إستئجار السيّارة وإبلاغ المستخدم بسبب الرفض",
    ""
  ),
  rentalRequestRejectedForOffice: new Notificatin(
    "تم رفض طلب إستئجار السيّارة الذي أرسلته",
    ""
  ),
};
