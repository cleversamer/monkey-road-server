const { Schema, model, Types, isValidObjectId } = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { server } = require("../../config/system");
const { user: validation } = require("../../config/models");
const countriesData = require("../../data/countries");

const CLIENT_SCHEMA = [
  "_id",
  "authType",
  "avatarURL",
  "name",
  "email",
  "phone",
  "balance",
  "favorites",
  "role",
  "verified",
  "favLang",
  "notifications",
  "lastLogin",
];

const verification = {
  email: {
    expiryInMins: 10,
    codeLength: validation.verificationCode.exactLength,
  },
  phone: {
    expiryInMins: 10,
    codeLength: validation.verificationCode.exactLength,
  },
  password: {
    expiryInMins: 10,
    codeLength: validation.verificationCode.exactLength,
  },
};

const MAX_NOTIFICATIONS_COUNT = 30;

const userSchema = new Schema(
  {
    authType: {
      type: String,
      required: true,
      trim: true,
      enum: validation.authTypes,
      default: validation.authTypes[0],
    },
    // The URL of user's avatar
    avatarURL: {
      type: String,
      default: "",
    },
    // The full name of the user
    name: {
      type: String,
      trim: true,
      required: true,
      // minLength: validation.name.minLength,
      // maxLength: validation.name.maxLength,
    },
    // The email of the user
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      minLength: validation.email.minLength,
      maxLength: validation.email.maxLength,
    },
    // The phone of the user
    phone: {
      // The full phone number (icc + nsn)
      full: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: countriesData.minPhone,
        maxlength: countriesData.maxPhone,
      },
      // The icc of user's phone
      icc: {
        type: String,
        required: true,
        trim: true,
        enum: countriesData.countries.map((c) => c.icc),
        minlength: countriesData.minICC,
        maxlength: countriesData.maxICC,
      },
      // The nsn of user's phone
      nsn: {
        type: String,
        required: true,
        trim: true,
        minLength: countriesData.minNSN,
        maxLength: countriesData.maxNSN,
      },
    },
    // The hashed password of the user
    password: {
      type: String,
      trim: true,
      default: "",
    },
    balance: {
      type: Number,
      default: 0,
      min: validation.balance.min,
      max: validation.balance.max,
    },
    // The role of the user
    role: {
      type: String,
      enum: validation.roles,
      default: validation.roles[0],
    },
    favLang: {
      type: String,
      enum: validation.favLanguages,
      default: validation.favLanguages[0],
    },
    // The email and phone verification status of the user
    verified: {
      email: {
        type: Boolean,
        default: false,
      },
      phone: {
        type: Boolean,
        default: false,
      },
    },
    // The notifications of the user
    notifications: {
      type: Array,
      default: [],
    },
    // User's favorite purchase cars
    favorites: {
      type: Array,
      default: [],
    },
    // The device token of the user (Used for sending notifications to it)
    deviceToken: {
      type: String,
      minLength: validation.deviceToken.minLength,
      maxLength: validation.deviceToken.maxLength,
    },
    // The last login date of the user
    lastLogin: {
      type: Date,
      default: new Date(),
    },
    // The email, phone, and password verification codes
    verification: {
      email: {
        code: {
          type: String,
          default: "",
        },
        expiryDate: {
          type: Date,
          default: "",
        },
      },
      phone: {
        code: {
          type: String,
          default: "",
        },
        expiryDate: {
          type: Date,
          default: "",
        },
      },
      password: {
        code: {
          type: String,
          default: "",
        },
        expiryDate: {
          type: Date,
          default: "",
        },
      },
    },
  },
  {
    minimize: false,
    timestamps: true,
  }
);

//////////////////// User's General Methods ////////////////////
userSchema.methods.genAuthToken = function () {
  try {
    const body = {
      sub: this._id.toHexString(),
      email: this.email,
      phone: this.phone.full,
      password: this.password + server.PASSWORD_SALT,
    };

    return jwt.sign(body, process.env["JWT_PRIVATE_KEY"]);
  } catch (err) {
    // TODO: write the error to the database
    return "auth-token-error";
  }
};

userSchema.methods.switchLanguage = function () {
  try {
    this.favLang = this.favLang === "en" ? "ar" : "en";
  } catch (err) {
    // TODO: write error to the DB
  }
};

userSchema.methods.addBalance = function (amount) {
  try {
    this.balance += amount;
  } catch (err) {
    // TODO: write error to the DB
  }
};

userSchema.methods.takeBalance = function (amount) {
  try {
    if (amount > this.balance) return false;
    this.balance -= amount;
    return true;
  } catch (err) {
    // TODO: write error to the DB
  }
};

userSchema.methods.updateLastLogin = function () {
  this.lastLogin = new Date();
};

userSchema.methods.genCode = function (length = 4) {
  try {
    const possibleNums = Math.pow(10, length - 1);
    return Math.floor(possibleNums + Math.random() * 9 * possibleNums);
  } catch (err) {
    // TODO: write the error to the database
  }
};

userSchema.methods.updateCode = function (key) {
  try {
    const { codeLength, expiryInMins } = verification[key];

    // Generate code
    const code = this.genCode(codeLength);

    // Generate expiry date
    const mins = expiryInMins * 60 * 1000;
    const expiryDate = new Date() + mins;

    // Update email verification code
    this.verification[key] = { code, expiryDate };
  } catch (err) {
    // TODO: write the error to the database
  }
};

userSchema.methods.isMatchingCode = function (key, code) {
  try {
    return this.verification[key].code == code;
  } catch (err) {
    // TODO: write the error to the database
    return false;
  }
};

userSchema.methods.isValidCode = function (key) {
  try {
    const { expiryDate } = this.verification[key];
    const { expiryInMins } = verification[key];

    // Measure the difference between now and code's expiry date
    const diff = new Date() - new Date(expiryDate);

    // Calculate expiry mins in milliseconds
    const time = expiryInMins * 60 * 1000;

    // Return true if milliseconds are greater than the difference
    // Otherwise, return false...
    return diff <= time;
  } catch (err) {
    // TODO: write the error to the database
    return false;
  }
};

userSchema.methods.isEmailVerified = function () {
  return this.verified.email;
};

userSchema.methods.verifyEmail = function () {
  this.verified.email = true;
};

userSchema.methods.isPhoneVerified = function () {
  return this.verified.phone;
};

userSchema.methods.verifyPhone = function () {
  this.verified.phone = true;
};

userSchema.methods.comparePassword = async function (candidate) {
  try {
    return await bcrypt.compare(candidate, this.password);
  } catch (err) {
    // TODO: write the error to the database
    return false;
  }
};

userSchema.methods.updatePassword = async function (newPassword) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(newPassword, salt);
    this.password = hashed;
  } catch (err) {
    // TODO: write the error to the database
  }
};

userSchema.methods.addToFavorites = function (purchaseCarId) {
  try {
    // Ensure that `rentCarId` is a valid MongoDB ObjectId
    if (isValidObjectId(purchaseCarId)) {
      purchaseCarId = Types.ObjectId(purchaseCarId);
    }

    // Add the rentCarId to the start of favorites array
    this.favorites.unshift(purchaseCarId);
  } catch (err) {
    // TODO: write the error to the database
  }
};

userSchema.methods.removeFromFavorites = function (purchaseCarId) {
  try {
    // Filter the favorites and delete the specified
    // rentCarId argument.
    this.favorites = this.favorites.filter(
      (item) => item.toString() !== purchaseCarId.toString()
    );
  } catch (err) {
    // TODO: write the error to the database
  }
};

userSchema.methods.addPaypalCard = function (
  firstname,
  lastname,
  address1,
  address2,
  city,
  region,
  country,
  postalCode
) {
  try {
    // Creating a new paypal
    const newPaypal = {
      type: "paypal",
      status: "active",
      visa: null,
      paypal: {
        firstname,
        lastname,
        address: {
          line1: address1,
          line2: address2,
        },
        city,
        region,
        country,
        postalCode,
      },
    };

    // Pushing it to the start of the array
    this.paymentCards.unshift(newPaypal);
  } catch (err) {
    // TODO: write the error to the database
  }
};

userSchema.methods.addVisaCard = function (
  nameOnCard,
  cardNumber,
  cvc,
  expiryDate,
  postalCode
) {
  try {
    // Creating a new visa
    const newVisa = {
      type: "visa",
      status: "active",
      paypal: null,
      visa: {
        nameOnCard,
        cardNumber,
        cvc,
        expiryDate,
        postalCode,
      },
    };

    // Pushing it to the start of the array
    this.paymentCards.unshift(newVisa);
  } catch (err) {
    // TODO: write the error to the database
  }
};

userSchema.methods.addNotification = function (notification) {
  try {
    // Making sure that the max notifications count
    // is considered.
    this.notifications = this.notifications.slice(0, MAX_NOTIFICATIONS_COUNT);
    if (this.notifications.length === MAX_NOTIFICATIONS_COUNT) {
      this.notifications.pop();
    }

    // Add the notification to the beginning of the array
    this.notifications.unshift(notification);
  } catch (err) {
    // TODO: write the error to the database
  }
};

userSchema.methods.seeNotifications = function () {
  try {
    // Return `true` if there are no notifications
    // True means no new notifications
    if (!this.notifications.length) {
      return true;
    }

    const list = [...this.notifications];

    // Declare a variable to track unseen notifications
    let isAllSeen = true;

    // Mark all notification as seen
    this.notifications = this.notifications.map((n) => {
      isAllSeen = isAllSeen && n.seen;

      return {
        ...n,
        seen: true,
      };
    });

    // Return the result
    return { isAllSeen, list };
  } catch (err) {
    // TODO: write the error to the database
    return false;
  }
};

userSchema.methods.clearNotifications = function () {
  try {
    const isEmpty = !this.notifications.length;
    this.notifications = [];
    return isEmpty;
  } catch (err) {
    // TODO: write the error to the database
    return false;
  }
};

userSchema.methods.updateDeviceToken = function (deviceToken) {
  try {
    if (!deviceToken) return;
    this.deviceToken = deviceToken;
  } catch (err) {
    // TODO: write error to the DB
  }
};

const User = model("User", userSchema);

module.exports = {
  User,
  CLIENT_SCHEMA,
};
