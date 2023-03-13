const {
  priceFor,
  coupon,
  value,
  validityHours,
} = require("../../models/price");

module.exports = Object.freeze({
  noPrices: {
    en: "Prices was not found for this item",
    ar: "لا يوجد أسعار لهذا البند",
  },
  invalidPriceFor: {
    en: `Item's price title should be ${priceFor.minLength}-${priceFor.maxLength} letters`,
    ar: `عنوان السعر يجب أن يكون بين ${priceFor.minLength}-${priceFor.maxLength} حرفًا`,
  },
  invalidCoupon: {
    en: `Price's coupon should be ${coupon.minLength}-${coupon.maxLength} letters`,
    ar: `كود الخصم يجب أن يكون بين ${coupon.minLength}-${coupon.maxLength} حرفًا`,
  },
  invalidValue: {
    en: `Price should be ${value.min}-${value.max} AED`,
    ar: `عنوان السعر يجب أن يكون بين ${value.min}-${value.max} درهم إماراتي`,
  },
  invalidValidityHours: {
    en: `Validity hours should be ${validityHours.min}-${validityHours.max} hours`,
    ar: `مدة الصلاحية يجب أن تكون بين ${validityHours.min}-${validityHours.max} ساعات`,
  },
});
