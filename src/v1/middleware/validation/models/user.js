module.exports = {
  name: { minLength: 8, maxLength: 64 },
  email: { minLength: 5, maxLength: 256 },
  phone: {
    nsn: { minLength: 4, maxLength: 13 },
  },
  roles: ["user", "admin"],
  deviceToken: { minLength: 1, maxLength: 1024 },
  password: { minLength: 8, maxLength: 64 },
  verificationCode: { exactLength: 4 },
};
