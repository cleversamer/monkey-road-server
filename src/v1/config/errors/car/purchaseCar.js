const {
  name,
  vin,
  model,
  kiloPerHour,
  phoneNumber,
  description,
} = require("../../models/purchaseCar");

module.exports = Object.freeze({
  notFound: {
    en: "Car was not found",
    ar: "السيّارة غير موجودة",
  },
  noCars: {
    en: "There're no cars for sale registered yet",
    ar: "لا يوجد هناك سيّارات للبيع مسجّلة بعد",
  },
  noSearchCars: {
    en: "No cars match your search term",
    ar: "لا توجد سيّارات لنتيجة مشابهة لنتيجة بحثك",
  },
  noSimilarCars: {
    en: "There're no similar cars",
    ar: "لا يوجد سيّارات مشابهة لهذه السيّارة",
  },
  noPostedCars: {
    en: "You haven't posted any car for sale",
    ar: "أنت لا تملك سيّارات للبيع بعد",
  },
  invalidName: {
    en: `Car's name should be (${name.minLength}-${name.maxLength} characters) length`,
    ar: `إسم السيّارة يجب أن يكون بين ${name.minLength}-${name.maxLength} حرفًا`,
  },
  invalidVIN: {
    en: `Car's VIN number shoud be ${vin.exactLength} characters length`,
    ar: `رقم المركبة يجب أن يكون ${vin.exactLength} حرفًا`,
  },
  invalidModel: {
    en: `Car's model should be (${model.minLength}-${model.maxLength} characters) length`,
    ar: `موديل السيّارة يجب أن يكون بين ${model.minLength}-${model.maxLength} حرفًا`,
  },
  invalidYear: {
    en: "Unsupported car's year",
    ar: "موديل سنة السيّارة غير مدعوم",
  },
  invalidENColor: {
    en: "English car's color isn't supported",
    ar: "لون السيّارة الإنجليزي غير مدعوم",
  },
  invalidARColor: {
    en: "Arabic car's color isn't supported",
    ar: "لون السيّارة العربي غير مدعوم",
  },
  invalidTrimLevel: {
    en: "Invalid trim level",
    ar: "مستوى تقليم السيّارة غير صالح",
  },
  invalidENVehicleType: {
    en: "English car's vehicle type is invalid",
    ar: "نوع المركبة الإنجليزي غير صالح",
  },
  invalidARVehicleType: {
    en: "Arabic car's vehicle type is invalid",
    ar: "نوع المركبة العربي غير صالح",
  },
  invalidNoOfSeats: {
    en: "Invalid car's number of seats",
    ar: "عدد مقاعد السيّارة غير صالح",
  },
  invalidKiloPerHour: {
    en: `Car's velocity should be ${kiloPerHour.min}-${kiloPerHour.max} km/h`,
    ar: `سرعة السيّارة يجب أن تكون بين ${kiloPerHour.min}-${kiloPerHour.max} كم/ساعة`,
  },
  invalidPrice: {
    en: `Car's price should be ${kiloPerHour.min}-${kiloPerHour.max} AED`,
    ar: `سعر السيّارة يجب أن تكون بين ${kiloPerHour.min}-${kiloPerHour.max} درهم إماراتي`,
  },
  invalidPhoneNumber: {
    en: `Phone number should be ${phoneNumber.minLength}-${phoneNumber.maxLength} characters length`,
    ar: `رقم الهاتف يجب أن يكون بين ${phoneNumber.minLength}-${phoneNumber.maxLength} حرفًا`,
  },
  invalidDescription: {
    en: `Car's description should be ${description.minLength}-${description.maxLength} characters length`,
    en: `وصف السيّارة يجب أن يكون بين ${description.minLength}-${description.maxLength} حرفًا`,
  },
});
