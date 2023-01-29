const { Schema, model, Types } = require("mongoose");
const { rentOrder: validation } = require("../../config/models");
const countriesData = require("../../data/countries");

// The data that will be received by the client side
const CLIENT_SCHEMA = [
  "_id",
  "author",
  "office",
  "rentCar",
  "fullName",
  "phoneNumber",
  "receptionLocation",
  "totalPrice",
  "status",
  "startDate",
  "endDate",
];

// The default schema of the model
const rentOrderSchema = new Schema(
  {
    // The author of the order
    author: {
      type: Types.ObjectId,
      required: true,
      ref: "User",
    },
    // The office of the rent car
    office: {
      type: Types.ObjectId,
      required: true,
      ref: "User",
    },
    // A reference to the rent car document
    rentCar: {
      type: Types.ObjectId,
      ref: "RentCar",
      required: true,
    },
    // The name of the recipient
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    // The phone number of the recipient
    phoneNumber: {
      // The full phone number (icc + nsn)
      full: {
        type: String,
        required: true,
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
    // The shipping address info
    receptionLocation: {
      title: String,
      longitude: String,
      latitude: String,
    },
    // The total price of the order
    totalPrice: {
      type: Number,
      required: true,
    },
    // The status of the order
    status: {
      type: String,
      required: true,
      trim: true,
      default: validation.statuses[0],
      enum: validation.statuses,
    },
    // The start date of car rental
    startDate: {
      type: String,
      required: true,
      trim: true,
    },
    // The end date of car rental
    endDate: {
      type: String,
      required: true,
      trim: true,
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
rentOrderSchema.index({ author: 1 });

// Creating an index on the office field to easily
// fetch office's pending orders.
rentOrderSchema.index({ office: 1 });

// Creating an index on the author field to easily
// fetch orders in a specific status
rentOrderSchema.index({ status: 1 });

// Order object methods
rentOrderSchema.methods.setEndDate = function (noOfDays) {
  const startDate = new Date(this.startDate);
  const endDate = new Date();
  endDate.setHours(startDate.getHours() + noOfDays * 24);

  this.endDate = endDate;
};

rentOrderSchema.methods.close = function () {
  this.status = "closed";
};

rentOrderSchema.methods.isClosed = function () {
  return this.status == "closed";
};

rentOrderSchema.methods.reject = function () {
  this.status = "rejected";
};

rentOrderSchema.methods.isRejected = function () {
  return this.status == "rejected";
};

rentOrderSchema.methods.approve = function () {
  this.status = "approved";
};

rentOrderSchema.methods.isApproveed = function () {
  return this.status == "approved";
};

// Creating the model
const RentOrder = model("RentOrder", rentOrderSchema);

// Exporting shared data about the model
module.exports = {
  RentOrder,
  CLIENT_SCHEMA,
};
