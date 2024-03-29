const { server } = require("../../system");

module.exports = Object.freeze({
  internal: {
    en: "An unexpected error happened on the server",
    ar: "حصل خطأ غير متوقع في الخادم",
  },
  unsupportedRoute: {
    en: "Unsupported route",
    ar: "الرابط غير مدعوم",
  },
  noPhoto: {
    en: "Please add a photo",
    ar: "يجب عليك إضافة صورة",
  },
  invalidFile: {
    en: "Invalid file",
    ar: "الملف غير صالح",
  },
  invalidCarId: {
    en: "Invalid car id",
    ar: "معرّف السيّارة غير صالح",
  },
  invalidOrderId: {
    en: "Invalid order id",
    ar: "معرّف الطلب غير صالح",
  },
  fileUploadError: {
    en: "Error uploading file",
    ar: "حصل خطأ عند رفع الملف",
  },
  invalidUrl: {
    en: "Please add a valid URL",
    ar: "من فضلك قم بإدخال رابط صالح",
  },
  invalidExtension: {
    en: "File extension is not supported",
    ar: "إمتداد الملف غير مدعوم",
  },
  invalidMongoId: {
    en: "Invalid ID",
    ar: "معرّف غير صالح",
  },
  noMongoId: {
    en: "You should add the ID",
    ar: "يجب عليك إضافة المعرّف",
  },
  largeFile: {
    en: `Maximum file upload size is ${server.MAX_FILE_UPLOAD_SIZE}MB`,
    ar: `الحد الأقصى لحجم ملف الرفع هو ${server.MAX_FILE_UPLOAD_SIZE} ميجا بايت`,
  },
  tempBlocked: {
    en: "Your device has been temporarily blocked",
    ar: "تم حظر جهازك مؤقتًا",
  },
  notification: {
    en: "Error sending notification",
    ar: "حصل خطأ عند إرسال الإشعار",
  },
  invalidSkipNumber: {
    en: "Skip number is required",
    ar: "عدد التخطي مطلوب",
  },
  invalidPageNumber: {
    en: "Page number is required",
    ar: "رقم الصفحة مطلوب",
  },
  invalidLimitNumber: {
    en: "Limit count is required",
    ar: "عدد التحديد مطلوب",
  },
  emailError: {
    en: "Error sending email",
    ar: "حصل خطأ في إرسال البريد",
  },
  errorExportingExcel: {
    en: "Error exporting excel file",
    ar: "حصل خطأ عند تصدير ملف الاكسل",
  },
  invalidLongitude: {
    en: `Longitude should be between -180-180`,
    ar: `خط الطول يجب أن يكون بين -180-180`,
  },
  invalidLatitude: {
    en: `Latitude should be between -90-90`,
    ar: `خط العرض يجب أن يكون بين -90-90`,
  },
});
