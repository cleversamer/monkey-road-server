module.exports = {
  name: { minLength: 8, maxLength: 64 },
  email: { minLength: 5, maxLength: 256 },
  phone: {
    nsn: { minLength: 4, maxLength: 13 },
  },
  // First value is the default value
  roles: ["user", "office", "admin"],
  authTypes: ["email", "google"],
  registerRoles: ["user"],
  deviceToken: { minLength: 0, maxLength: 1024 },
  password: { minLength: 8, maxLength: 64 },
  verificationCode: { exactLength: 4 },
  balance: { min: 0, max: 1000 * 1000 },
  paymentDeliveryAmount: { min: 10, max: 1000 * 1000 },
  // First value is the default value
  favLanguages: ["ar", "en"],
  notificationTitle: { min: 3, max: 128 },
  notificationBody: { min: 3, max: 265 },
};
