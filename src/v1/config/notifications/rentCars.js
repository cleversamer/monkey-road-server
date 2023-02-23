const Notificatin = require("./Notification");

module.exports = {
  postAddedForAdmin: (photoURL, rentCarId) =>
    new Notificatin(
      "New pending rental post",
      "طلب نشر سيّارة للإيجار",
      "There is a new pending rental post, please check it out",
      "يوجد هناك طلب نشر سيّارة للإيجار جديد تفحّصه",
      photoURL,
      "rentCarDetails",
      rentCarId
    ),
  postAddedForOffice: (photoURL, rentCarId) =>
    new Notificatin(
      "Your request has been sent successfully",
      "تم إرسال طلبك بنجاح",
      "Your request to post your rental car has been sent to admin and is currently under review",
      "تم إرسال طلب نشر سيّارتك للإيجار إلى مدير النظام وهو الآن قيد المراجعة",
      photoURL,
      "rentCarDetails",
      rentCarId
    ),
  postRejectedForAdmin: (body, photoURL) =>
    new Notificatin(
      "Car rental request has been rejected and the rental office has been successfully notified",
      "تم رفض طلب سيّارة للإيجار وإعلام مكتب التأجير بنجاح",
      body,
      body,
      photoURL
    ),
  postRejectedForOffice: (body, photoURL) =>
    new Notificatin(
      "Rental post request",
      "طلب نشر سيّارة للإيجار",
      body,
      body,
      photoURL
    ),
  postAcceptedForAdmin: (photoURL, rentCarId) =>
    new Notificatin(
      "Your rental post request has been approved",
      "تم قبول طلب نشر سيّارة للإيجار بنجاح",
      "Rental post request has been successfully approved and the office has been notified",
      "تم قبول طلب نشر السيّارة بنجاح وإعلام مكتب التأجير بذلك",
      photoURL,
      "rentCarDetails",
      rentCarId
    ),
  postAcceptedForOffice: (photoURL, rentCarId) =>
    new Notificatin(
      "Rental post request",
      "طلب نشر سيّارة للإيجار",
      "Your request has been approved",
      "تم قبول طلبك",
      photoURL,
      "rentCarDetails",
      rentCarId
    ),
  rentalRequestForAdmin: (photoURL) =>
    new Notificatin(
      "New car rental order",
      "طلب استئجار سيّارة جديد",
      "There is a new car rental order which is under review by the office now",
      "هناك طلب استئجار سيّارة جديد وهو قيد المراجعة من طرف مكتب التأجير الآن",
      photoURL
    ),
  rentalRequestForOffice: (photoURL) =>
    new Notificatin(
      "New car rental order",
      "طلب استئجار سيّارة جديد",
      "You just received a new car rental order, please review and respond to it",
      "لقد وصلك طلب استئجار سيّارة جديد يرجى مراجعته والرد عليه",
      photoURL
    ),
  rentalRequestForUser: (photoURL) =>
    new Notificatin(
      "Your order has been sent successfully",
      "تم إرسال طلبك بنجاح",
      "Your order has been sent to the office and is now under review",
      "تم إرسال طلبك إلى مكتب التأجير وهو قيد المراجعة الآن",
      photoURL
    ),
  rentalRequestApprovedForAdmin: (photoURL) =>
    new Notificatin(
      "Rental order has been approved",
      "تم قبول طلب استئجار",
      "There is a car rental order that has been approved by the office now and is waiting for payment from the renter",
      "هناك طلب استئجار سيّارة تم قبوله من طرف مكتب التأجير الآن وهو بانتظار الدفع من طرف المستأجر",
      photoURL
    ),
  rentalRequestApprovedForOffice: (photoURL) =>
    new Notificatin(
      "Rental order has been approved",
      "تم قبول طلب استئجار",
      "You just approved the rental order and it is now waiting for payment from the renter before delivery",
      "لقد قمت بقبول طلب التأجير وهو الآن بانتظار الدفع من قبل المستأجر قبل التسليم",
      photoURL
    ),
  rentalRequestApprovedForUser: (photoURL) =>
    new Notificatin(
      "Rental order has been approved",
      "تم قبول طلب استئجار",
      "Your car rental order has been approved by the office, please pay to receive your request",
      "تم قبول طلب استئجار سيّارة من طرف مكتب التأجير يرجى الدفع لاستلام طلبك",
      photoURL
    ),
  rentalRequestPaidForAdmin: (photoURL) =>
    new Notificatin(
      "The rental amount was paid by a renter",
      "تم دفع مبلغ التأجير من مستأجر",
      "There is a car rental order that has been paid by the renter and is now waiting for delivery by the office",
      "هناك طلب استئجار سيّارة تم دفعه من طرف المستأجر وهو الآن بانتظار التسليم من طرف مكتب التأجير",
      photoURL
    ),
  rentalRequestPaidForOffice: (photoURL) =>
    new Notificatin(
      "The rental amount was paid by a renter",
      "تم دفع مبلغ التأجير من مستأجر",
      "There is a car rental order that has been paid by the renter, please go to the delivery procedures to hand over the car to the renter",
      "هناك طلب استئجار سيّارة تم دفعه من طرف المستأجر يرجى التوجه إلى إجراءات التسليم لتسليم السيّارة للمستأجر",
      photoURL
    ),
  rentalRequestPaidForUser: (photoURL) =>
    new Notificatin(
      "The rental amount was paid successfully",
      "تم دفع مبلغ التأجير بنجاح",
      "Your order has been paid and the car will be delivered to you within the specified period",
      "إجراء طلبك اكتمل وسيتم تسليمك السيّارة في المدة المحددة",
      photoURL
    ),
  rentalRequestRejectedForAdmin: (body, photoURL) =>
    new Notificatin(
      "A car rental order has been rejected by an office",
      "تم رفض طلب استئجار سيّارة من طرف مكتب تأجير",
      body,
      body,
      photoURL
    ),
  rentalRequestRejectedForOffice: (body, photoURL) =>
    new Notificatin(
      "The car rental order is rejected and the user is informed of the reason for the rejection",
      "تم رفض طلب استئجار السيّارة وإبلاغ المستخدم بسبب الرفض",
      body,
      body,
      photoURL
    ),
  rentalRequestRejectedForUser: (body, photoURL) =>
    new Notificatin(
      "Your car rental order was rejected",
      "تم رفض طلب استئجار السيّارة الذي أرسلته",
      body,
      body,
      photoURL
    ),
  transactionNotificationIncomplete: () =>
    new Notificatin(
      "You have a new incomplete transaction",
      "لديك معاملة ماليّة جديدة بانتظار الدفع",
      "You have a new incomplete transaction, please check your transactions",
      "لديك معاملة ماليّة جديدة يرجى مراجعة سجل المعاملات الماليّة"
    ),
  transactionNotificationComplete: () =>
    new Notificatin(
      "Your transaction has been completed successfully",
      "تم إكمال معاملتك الماليّة بنجاح",
      "You can review your transactions and make sure it is complete",
      "بإمكانك مراجعة سجل المعاملات الماليّة والتأكد من صحة الاكتمال"
    ),
  rentalRequestDeliveredForAdmin: (photoURL) =>
    new Notificatin(
      "A car has been delivered to a renter",
      "تم تأكيد تسليم سيّارة لمستأجر",
      "The delivery of a car to a renter has been confirmed by an office",
      "تم تأكيد تسليم سيّارة لمستأجر من طرف مكتب تأجير",
      photoURL
    ),
  rentalRequestDeliveredForOffice: (photoURL) =>
    new Notificatin(
      "The car has been delivered to the renter",
      "تم تأكيد تسليم السيّارة للمستأجر",
      "Delivery is confirmed and the renter and admin are notified",
      "تم تأكيد التسليم وإعلام المستأجر ومدير النظام بذلك",
      photoURL
    ),
  rentalRequestDeliveredForUser: (photoURL) =>
    new Notificatin(
      "The car has been delivered to you",
      "تم تأكيد تسليم السيّارة لك",
      "The car has been confirmed to be delivered to you by the office that owns the car",
      "تم تأكيد تسليم السيّارة لك من طرف مكتب التأجير المالك للسيّارة",
      photoURL
    ),
};
