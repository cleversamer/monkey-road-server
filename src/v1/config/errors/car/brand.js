const { name } = require("../../models/brand");

module.exports = Object.freeze({
  notFound: {
    en: "Brand was not found",
    ar: "شركة السيّارات غير موجودة",
  },
  noBrands: {
    en: "There're no brands registered yet",
    ar: "لا يوجد هناك شركات سيّارات مسجّلة بعد",
  },
  invalidId: {
    en: "Invalid brand id",
    ar: "معرّف شركة التصنيع غير صالح",
  },
  noPhoto: {
    en: "You have to add a picture",
    ar: "يجب عليك إضافة صورة",
  },
  invalidName: {
    en: `Brand name should be ${name.minLength}-${name.maxLength} characters length`,
    ar: `إسم شركة التصنيع يجب أن يكون بين ${name.minLength}-${name.maxLength} حرفًا`,
  },
  alreadyExists: {
    en: "Brand name already exists",
    ar: "إسم شركة التصنيع موجود مسبقًا",
  },
});
