const { Schema, model, Types } = require("mongoose");
const { order: validation } = require("../../config/models");

// The data that will be received by the client side
const CLIENT_SCHEMA = [
  "_id",
  "author",
  "seller",
  "location",
  "totalPrice",
  "rentCar",
  "purpose",
  "status",
  "date",
];

// The default schema of the model
const orderSchema = new Schema(
  {
    // The author of the order
    author: {
      name: {
        type: String,
        required: true,
      },
      ref: {
        type: Types.ObjectId,
        required: true,
        ref: "User",
      },
    },
    // The shipping address data
    // Compulsory: when requesting a car rental
    // Optional: when request posting a rent car
    location: {
      title: String,
      longitude: String,
      latitude: String,
    },
    // The total price of the order
    totalPrice: {
      type: Number,
      required: true,
    },
    // A reference to the rent car document
    rentCar: {
      type: Types.ObjectId,
      ref: "RentCar",
      required: true,
    },
    // The purpose of the order
    purpose: {
      en: {
        type: String,
        required: true,
        trim: true,
        enum: validation.purposes.en,
      },
      ar: {
        type: String,
        required: true,
        trim: true,
        enum: validation.purposes.ar,
      },
    },
    // The status of the order
    status: {
      en: {
        type: String,
        required: true,
        default: validation.status.en[0],
        trim: true,
        enum: validation.status.en,
      },
      ar: {
        type: String,
        required: true,
        default: validation.status.ar[0],
        trim: true,
        enum: validation.status.ar,
      },
    },
    // The creation date of the order
    date: {
      type: String,
      required: true,
      trim: true,
      default: new Date(),
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

// Creating an index on the author field to easily
// fetch user's orders.
orderSchema.index({ author: 1 });

// Creating an index on the author field to easily
// fetch orders in a specific status
orderSchema.index({ status: 1 });

// Order object methods
orderSchema.methods.cancel = function () {
  this.status.en = "closed";
  this.status.ar = "مغلق";
};

orderSchema.methods.reject = function () {
  this.status.en = "rejected";
  this.status.ar = "مرفوض";
};

orderSchema.methods.approve = function () {
  this.status.en = "approved";
  this.status.ar = "مقبول";
};

// Creating the model
const Order = model("Order", orderSchema);

// Exporting shared data about the model
module.exports = {
  Order,
  CLIENT_SCHEMA,
};
