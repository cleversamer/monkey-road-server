module.exports = {
  name: { minLength: 8, maxLength: 64 },
  email: { minLength: 5, maxLength: 256 },
  phone: {
    nsn: { minLength: 4, maxLength: 13 },
  },
  roles: ["user", "office", "admin"],
  authTypes: ["email", "google"],
  registerRoles: ["user"],
  deviceToken: { minLength: 0, maxLength: 1024 },
  password: { minLength: 8, maxLength: 64 },
  verificationCode: { exactLength: 4 },
  balance: { min: 0, max: 1000 * 1000 },
  paymentDeliveryAmount: { min: 10, max: 1000 * 1000 },
};
