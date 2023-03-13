module.exports = {
  priceFor: { minLength: 1, maxLength: 128 },
  value: { min: 0, max: 1000 * 1000, default: 100 },
  coupon: { minLength: 1, maxLength: 128 },
  validityHours: { min: 0, max: 100 * 1000 },
};
