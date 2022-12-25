module.exports = {
  name: { minLength: 3, maxLength: 64 },
  model: { minLength: 3, maxLength: 64 },
  description: { minLength: 0, maxLength: 1024 },
  photos: { min: 1, max: 6 },
  price: {
    daily: { min: 3, max: 100 * 1000 },
    weekly: { min: 3, max: 100 * 1000 },
    monthly: { min: 3, max: 100 * 1000 },
    deposit: { min: 3, max: 100 * 1000, default: 0 },
  },
};
