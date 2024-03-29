const {
  name,
  vin,
  model,
  kiloPerHour,
  phoneNumber,
  description,
  price,
} = require("../../models/purchaseCar");

module.exports = Object.freeze({
  invalidId: {
    en: "Invalid car id",
    ar: "معرّف السيّارة غير صالح",
  },
  notFound: {
    en: "Car was not found",
    ar: "السيّارة غير موجودة",
  },
  notPaid: {
    en: "Car's post cost was not paid",
    ar: "تكاليف نشر السيّارة غير مدفوعة",
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
    ar: "نوع وقود المركبة الإنجليزي غير صالح",
  },
  invalidARVehicleType: {
    en: "Arabic car's vehicle type is invalid",
    ar: "نوع المركبة العربي غير صالح",
  },
  invalidENFuelType: {
    en: "English car's fuel type is invalid",
    ar: "نوع وقود المركبة الإنجليزي غير صالح",
  },
  invalidARFuelType: {
    en: "Arabic car's fuel type is invalid",
    ar: "نوع وقود المركبة العربي غير صالح",
  },
  invalidNoOfSeats: {
    en: "Invalid car's number of seats",
    ar: "عدد مقاعد السيّارة غير صالح",
  },
  invalidKiloPerHour: {
    en: `Car's velocity should be ${kiloPerHour.min}-${kiloPerHour.max} km/h`,
    ar: `سرعة السيّارة يجب أن تكون بين ${kiloPerHour.min}-${kiloPerHour.max} كيلومتر في الساعة`,
  },
  invalidPrice: {
    en: `Car's price should be ${price.min.toLocaleString()}-${price.max.toLocaleString()} AED`,
    ar: `سعر السيّارة يجب أن تكون بين ${price.min.toLocaleString()}-${price.max.toLocaleString()} درهم إماراتي`,
  },
  invalidPhoneNumber: {
    en: `Phone number should be ${phoneNumber.minLength}-${phoneNumber.maxLength} characters length`,
    ar: `رقم الهاتف يجب أن يكون بين ${phoneNumber.minLength}-${phoneNumber.maxLength} حرفًا`,
  },
  invalidDescription: {
    en: `Car's description should be ${description.minLength}-${description.maxLength} characters length`,
    ar: `وصف السيّارة يجب أن يكون بين ${description.minLength}-${description.maxLength} حرفًا`,
  },
  alreadySold: {
    en: "Car is already marked as sold",
    ar: "تم تعليم السيّارة على أنها مُباعة مسبقًا",
  },
});
