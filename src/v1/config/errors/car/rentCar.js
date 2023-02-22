const {
  name,
  model,
  description,
  searchTerm,
  price,
} = require("../../models/rentCar");
const brand = require("../../models/brand");

module.exports = Object.freeze({
  notFound: {
    en: "Car was not found",
    ar: "السيّارة غير موجودة",
  },
  noCars: {
    en: "There're no rent cars registered yet",
    ar: "لا يوجد هناك سيّارات إيجار مسجّلة بعد",
  },
  noNotAcceptedCars: {
    en: "There're no not accepted rent cars",
    ar: "لا يوجد هناك سيّارات إيجار غير مقبولة",
  },
  noSearchCars: {
    en: "No cars match your search term",
    ar: "لا توجد سيّارات مشابهة لنتيجة بحثك",
  },
  noSimilarCars: {
    en: "There're no similar cars",
    ar: "لا يوجد سيّارات مشابهة لهذه السيّارة",
  },
  noPostedCars: {
    en: "You haven't posted any car for rent",
    ar: "أنت لا تملك سيّارات للإيجار بعد",
  },
  invalidName: {
    en: `Car name should be (${name.minLength}-${name.maxLength} characters) length`,
    ar: `إسم السيّارة يجب أن يكون بين ${name.minLength}-${name.maxLength} حرفًا`,
  },
  invalidModel: {
    en: `Car model should be (${model.minLength}-${model.maxLength} characters) length`,
    ar: `موديل السيّارة يجب أن يكون بين ${model.minLength}-${model.maxLength} حرفًا`,
  },
  invalidENColor: {
    en: "English car's color isn't supported",
    ar: "لون السيّارة الإنجليزي غير مدعوم",
  },
  invalidARColor: {
    en: "Arabic car's color isn't supported",
    ar: "لون السيّارة العربي غير مدعوم",
  },
  invalidENBrand: {
    en: `English car's brand should be ${brand.name.minLength}-${brand.name.maxLength} characters length`,
    ar: `إسم الشركة المصنّعة الإنجليزي للسيّارة يجب أن يكون بين ${brand.name.minLength}-${brand.name.maxLength} حرفًا`,
  },
  invalidARBrand: {
    en: `Arabic car's brand should be ${brand.name.minLength}-${brand.name.maxLength} characters length`,
    ar: `إسم الشركة المصنّعة العربي للسيّارة يجب أن يكون بين ${brand.name.minLength}-${brand.name.maxLength} حرفًا`,
  },
  invalidYear: {
    en: "Unsupported car's year",
    ar: "موديل سنة السيّارة غير مدعوم",
  },
  invalidDescription: {
    en: `Car's description should be ${description.minLength}-${description.maxLength} characters length`,
    ar: `وصف السيّارة يجب أن يكون بين ${description.minLength}-${description.maxLength} حرفًا`,
  },
  invalidSearchTerm: {
    en: `Search term should be ${searchTerm.minLength}-${searchTerm.maxLength} characters length`,
    ar: `عبارة البحث يجب أن تكون بين ${searchTerm.minLength}-${searchTerm.maxLength} حرفًا`,
  },
  invalidDailyPrice: {
    en: `Daily car rental price should be ${price.daily.min.toLocaleString()}-${price.daily.max.toLocaleString()} AED`,
    ar: `سعر تأجير السيّارة اليومي يجب أن يكون بين ${price.daily.min.toLocaleString()}-${price.daily.max.toLocaleString()} درهم إماراتي`,
  },
  invalidWeeklyPrice: {
    en: `Weekly car rental price should be ${price.weekly.min.toLocaleString()}-${price.weekly.max.toLocaleString()} AED`,
    ar: `سعر تأجير السيّارة الإسبوعي يجب أن يكون بين ${price.weekly.min.toLocaleString()}-${price.weekly.max.toLocaleString()} درهم إماراتي`,
  },
  invalidMonthlyPrice: {
    en: `Monthly car rental price should be ${price.monthly.min.toLocaleString()}-${price.monthly.max.toLocaleString()} AED`,
    ar: `سعر تأجير السيّارة الشهري يجب أن يكون بين ${price.monthly.min.toLocaleString()}-${price.monthly.max.toLocaleString()} درهم إماراتي`,
  },
  invalidDeposit: {
    en: `Car's depost should be ${price.deposit.min.toLocaleString()}-${price.deposit.max.toLocaleString()} AED`,
    ar: `تأمين السيّارة يجب أن يكون بين  ${price.deposit.min.toLocaleString()}-${price.deposit.max.toLocaleString()} درهم إماراتي`,
  },
  alreadyAccepted: {
    en: "Car is already accepted",
    ar: "تم قبول السيّارة مسبقًا",
  },
  invalidPrice: {
    en: `Rent car price should be between ${price.daily.min}-${price.daily.max} AED`,
    ar: `سعر سيّارة الإيجار يجب أن يكون بين ${price.daily.min}-${price.daily.max} درهم إماراتي`,
  },
  requestNotAcceptedCar: {
    en: "You can't request inactive car",
    ar: "لا يمكنك إستئجار سيّارة غير نشطة",
  },
  requestArchivedCar: {
    en: "You can't request archived car",
    ar: "لا يمكنك إستئجار سيّارة مؤرشفة",
  },
  requestCarTwice: {
    en: "You can't request a rental for the same car twice",
    ar: "لا يمكنك طلب إستئجار نفس السيّارة مرتين",
  },
  orderTimeConflict: {
    en: "The time you chose conflicts with another order for this car",
    ar: "الوقت الذي إخترته يتعارض مع طلب آخر لهذه السيّارة",
  },
  alreadyArchived: {
    en: "Car is already archived",
    ar: "السيّارة مؤرشفة مسبقًا",
  },
});
