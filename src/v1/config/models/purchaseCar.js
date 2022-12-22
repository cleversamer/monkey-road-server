module.exports = {
  name: { minLength: 3, maxLength: 64 },
  vin: { exactLength: 17 },
  model: { minLength: 3, maxLength: 64 },
  kiloPerHour: { min: 95, max: 105 },
  price: { min: 1, max: 1000000 },
  phoneNumber: { minLength: 5, maxLength: 26 },
  description: { minLength: 3, maxLength: 1024 },
  photos: { min: 1, max: 6 },
};
