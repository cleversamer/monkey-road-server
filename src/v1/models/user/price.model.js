const { Schema, model } = require("mongoose");
const { price: validation } = require("../../config/models");

// The data that will be received by the client side
const CLIENT_SCHEMA = ["_id", "active", "priceFor", "value"];

// The default schema of the model
const priceSchema = new Schema(
  {
    active: {
      type: Boolean,
      default: true,
    },
    priceFor: {
      type: String,
      required: true,
      trim: true,
      minLength: validation.priceFor.minLength,
      maxLength: validation.priceFor.maxLength,
    },
    coupon: {
      type: String,
      required: true,
      trim: true,
      minLength: validation.coupon.minLength,
      maxLength: validation.coupon.maxLength,
    },
    value: {
      type: Number,
      required: true,
      min: validation.value.min,
      max: validation.value.max,
      default: validation.value.default,
    },
    expireAt: {
      type: Date,
      default: null,
    },
  },
  {
    // To not avoid empty object when creating the document
    minimize: false,
    // To automatically write creation/update timestamps
    // Note: the update timestamp will be updated automatically
    timestamps: true,
  }
);

// Methods
priceSchema.methods.setExpiryDate = function (validityHours) {
  try {
    if (!validityHours) {
      this.expireAt = null;
      return;
    }

    const hoursInMilliseconds = parseInt(validityHours) * 60 * 60 * 1000;
    const expiryDate = new Date() + hoursInMilliseconds;
    this.expireAt = expiryDate;
  } catch (err) {
    // TODO: write error to the DB
    throw err;
  }
};

// Creating the model
const Price = model("Price", priceSchema);

// Exporting shared data about the model
module.exports = {
  Price,
  CLIENT_SCHEMA,
};
