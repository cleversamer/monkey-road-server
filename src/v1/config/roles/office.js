module.exports = Object.freeze({
  user: {
    "read:own": ["*"],
    "update:own": ["*"],
  },
  emailVerificationCode: {
    "read:own": ["*"],
    "update:own": ["*"],
  },
  phoneVerificationCode: {
    "read:own": ["*"],
    "update:own": ["*"],
  },
  password: {
    "update:own": ["*"],
  },
  notification: {
    "read:own": ["*"],
    "delete:own": ["*"],
  },
  favorites: {
    "create:own": ["*"],
    "read:own": ["*"],
    "delete:own": ["*"],
  },
  purchaseCar: {
    "create:own": ["*"],
    "read:own": ["*"],
  },
  rentCar: {
    "create:own": ["*"],
    "read:own": ["*"],
    "update:own": ["*"],
  },
  rentOrder: {
    "create:own": ["*"],
  },
  order: {
    "read:own": ["*"],
    "update:own": ["*"],
    "delete:own": ["*"],
  },
  transaction: {
    "read:own": ["*"],
  },
});
