const {
  paymentDeliveryAmount,
  notificationTitle,
  notificationBody,
} = require("../../models/user");

module.exports = Object.freeze({
  invalidId: {
    en: "Invalid user ID",
    ar: "معرّف المستخدم غير صالح",
  },
  notFound: {
    en: "User was not found",
    ar: "المستخدم غير موجود",
  },
  officeNotFound: {
    en: "Office was not found",
    ar: "مكتب التأجير غير موجود",
  },
  notOffice: {
    en: "User is not an office",
    ar: "المستخدم ليس مكتب تأجير",
  },
  emailAlreadyVerified: {
    en: "Your email is already verified",
    ar: "تم التحقق من بريدك الإلكتروني مسبقًا",
  },
  phoneAlreadyVerified: {
    en: "Your phone number is already verified",
    ar: "تم التحقق من رقم هاتفك مسبقًا",
  },
  invalidRole: {
    en: "Invalid user role",
    ar: "الصلاحيّة المختارة غير صالحة",
  },
  foundWithInvalidRole: {
    en: "User is registered with another role",
    ar: "المستخدم مسجّل بصلاحيّة أخرى",
  },
  alreadyVerified: {
    en: "User’s email and phone number are already verified",
    ar: "تم التحقق من رقم هاتف وبريد المستخدم مسبقًا",
  },
  unsupportedLanguage: {
    en: "Unsupported language",
    ar: "اللغة غير مدعومة",
  },
  noLanguage: {
    en: "Please select your favorite language",
    ar: "من فضلك قم بإختيار لغتك المفضّلة",
  },
  unsupportedReceiverType: {
    en: "Unsupported receiver type",
    ar: "نوع المستقبل غير مدعوم",
  },
  notUpdated: {
    en: "There's no new data to update",
    ar: "لا يوجد بيانات جديدة للتحديث",
  },
  notificationsSeen: {
    en: "There are no new notifications out there",
    ar: "لا يوجد هناك إشعارات جديدة",
  },
  noNotifications: {
    en: "You don't have any notifications",
    ar: "ليس لديك إشعارات",
  },
  noFavorites: {
    en: "You don't have favorite cars",
    ar: "ليس لديك سيّارات في المفضّلة",
  },
  invalidAuthType: {
    en: "Invalid authentication method",
    ar: "طريقة المصادقة غير صالحة",
  },
  updateAdminRole: {
    en: "You can't update admin's role",
    ar: "لا يمكنك تعديل صلاحيّة الآدمن",
  },
  errorSendingNotification: {
    en: "Error sending notification",
    ar: "حصل خطأ عند إرسال الإشعار",
  },
  invalidPaymentDeliveryAmount: {
    en: `Payment delivery amount should be ${paymentDeliveryAmount.min.toLocaleString()}-${paymentDeliveryAmount.max.toLocaleString()} AED`,
    ar: `مبلغ تسليم الدفعة يجب أن يكون بين ${paymentDeliveryAmount.min.toLocaleString()}-${paymentDeliveryAmount.max.toLocaleString()} درهم إماراتي`,
  },
  deliveredAmountNotAvailable: {
    en: "The delivery amount is not available in the office account",
    ar: "مبلغ التسليم غير متوفر في حساب مكتب التأجير",
  },
  invalidUserIds: {
    en: "User IDS should be a list",
    ar: "معرّفات المستخدمين يجب أن تكون قائمة",
  },
  invalidNotificationTitle: {
    en: `Notification's title should be ${notificationTitle.min}-${notificationTitle.max} letters`,
    ar: `عنوان الإشعار يجب أن يكون بين ${notificationTitle.min}-${notificationTitle.max} حرفًا`,
  },
  invalidNotificationBody: {
    en: `Notification's body should be ${notificationBody.min}-${notificationBody.max} letters`,
    ar: `محتوى الإشعار يجب أن يكون بين ${notificationBody.min}-${notificationBody.max} حرفًا`,
  },
});
