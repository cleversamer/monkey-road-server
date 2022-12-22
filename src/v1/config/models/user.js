module.exports = {
  name: { minLength: 8, maxLength: 64 },
  email: { minLength: 5, maxLength: 256 },
  phone: {
    nsn: { minLength: 4, maxLength: 13 },
  },
  roles: ["user", "office", "admin"],
  deviceToken: { minLength: 1, maxLength: 1024 },
  password: { minLength: 8, maxLength: 64 },
  verificationCode: { exactLength: 4 },
  paymentCardTypes: ["visa", "paypal"],
  paymentCardStatus: ["active", "deleted"],
  visa: {
    cardNumber: { exactLength: 16 },
    cvc: { exactLength: 3 },
    expiryDate: { minLength: 4, maxLength: 5 },
    postalCode: { minLength: 5, maxLength: 10 },
  },
  paypal: {
    firstname: { minLength: 4, maxLength: 30 },
    lastname: { minLength: 4, maxLength: 30 },
    city: { minLength: 2, maxLength: 64 },
    region: { minLength: 2, maxLength: 64 },
    country: { minLength: 2, maxLength: 64 },
    postalCode: { minLength: 5, maxLength: 10 },
    address: {
      line1: { minLength: 4, maxLength: 64 },
      line2: { minLength: 4, maxLength: 64 },
    },
  },
};
