const {
  noOfDays,
  locationTitle,
  fullName,
  reasonForRejection,
} = require("../../models/rentOrder");

module.exports = Object.freeze({
  noOrders: {
    en: "You haven't added any order yet",
    ar: "أنت لم تضيف أيّ طلب بعد",
  },
  notFound: {
    en: "Order was not found",
    ar: "الطلب غير موجود",
  },
  notOwner: {
    en: "This order doesn't belong to you",
    ar: "هذا الطلب لا ينتمي إليك",
  },
  notReceiverOffice: {
    en: "You haven't received this order",
    ar: "أنت لم تستقبل هذا الطلب",
  },
  alreadyApproved: {
    en: "Order is already approved",
    ar: "تم قبول الطلب مسبقًا",
  },
  alreadyClosed: {
    en: "Order is already closed",
    ar: "تم إغلاق الطلب مسبقًا",
  },
  alreadyRejected: {
    en: "Order is already rejected",
    ar: "تم رفض الطلب مسبقًا",
  },
  noReceivedOrders: {
    en: "There're no received orders yet",
    ar: "لا يوجد طلبات تأجير مستلمة بعد",
  },
  invalidNoOfDays: {
    en: `Number of days should be ${noOfDays.min}-${noOfDays.max} days`,
    ar: `عدد الأيام يجب أن يكون بين ${noOfDays.min}-${noOfDays.max} يومًا`,
  },
  invalidLocationTitle: {
    en: `Location title should be ${locationTitle.minLength}-${locationTitle.maxLength} characters`,
    ar: `إسم العنوان يجب أن يكون بين ${locationTitle.minLength}-${locationTitle.maxLength} حرفًا`,
  },
  invalidFullName: {
    en: `Full name should be ${fullName.minLength}-${fullName.maxLength} characters`,
    ar: `الإسم الكامل يجب أن يكون بين ${fullName.minLength}-${fullName.maxLength} حرفًا`,
  },
  rejectNotPendingOrApproved: {
    en: "You can reject only pending and waiting for payment orders",
    ar: "يمكنك رفض الطلبات المعلّقة وبإنتظار الدفع فقط",
  },
  closePendingOrPaidOrder: {
    en: "You can only close pending and approved orders",
    ar: "يمكنك إغلاق الطلبات التي هي قيد الإنتظار والموافق عليها فقط",
  },
  deletePaidOrder: {
    en: "You can't delete an order if it's waiting for delivery",
    ar: "لا يمكنك حذف طلب بإنتظار التسليم",
  },
  deleteDeliveredOrder: {
    en: "You can't delete an order if it's delivered",
    ar: "لا يمكنك حذف طلب تم تسليمه",
  },
  payUnapprovedOrder: {
    en: "You can't pay for an unapproved order",
    ar: "لا يمكنك الدفع مقابل طلب غير موافق عليه",
  },
  deliverUnpaidOrder: {
    en: "You can't deliver an unpaid order",
    ar: "لا يمكنك تسليم طلب لم يتم دفعه",
  },
  noAddedOrders: {
    en: "There are no rental orders until now",
    ar: "لا توجد طلبات تأجير حتى الآن",
  },
  invalidRejectionReason: {
    en: `Rejection reason should be ${reasonForRejection.minLength}-${reasonForRejection.maxLength} letters`,
    ar: `سبب الرفض يجب أن يكون بين ${reasonForRejection.minLength}-${reasonForRejection.maxLength} حرفًا`,
  },
  invalidStartDate: {
    en: "Invalid start date",
    ar: "تاريخ بداية التأجير غير صالح",
  },
  lowerStartDate: {
    en: "The start date precedes the current date",
    ar: "تاريخ البدء يسبق التاريخ الحالي",
  },
});
