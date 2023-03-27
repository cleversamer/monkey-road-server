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
  "invoiceURL",
  "status",
  "reasonFor",
  "startDate",
  "endDate",
  "noOfDays",
  "date",
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
      minLength: validation.fullName.minLength,
      maxLength: validation.fullName.maxLength,
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
      title: {
        type: String,
        required: true,
        trim: true,
        minLength: validation.locationTitle.minLength,
        maxLength: validation.locationTitle.maxLength,
      },
      longitude: {
        type: String,
        required: true,
      },
      latitude: {
        type: String,
        required: true,
      },
    },
    // Invoice URL
    invoiceURL: {
      type: String,
      trim: true,
      default: "",
    },
    // Bank transaction ID
    bankTransactionId: {
      type: String,
      trim: true,
      default: "",
    },
    // The total price of the order
    totalPrice: {
      type: Number,
      required: true,
      default: 0,
    },
    deservedAmount: {
      forAdmin: {
        type: Number,
        default: 0,
      },
      forOffice: {
        type: Number,
        default: 0,
      },
    },
    // The status of the order
    status: {
      type: String,
      required: true,
      trim: true,
      default: validation.statuses[0],
      enum: validation.statuses,
    },
    // Reason for rejection (in case of order is rejected)
    reasonFor: {
      rejection: {
        type: String,
        trim: true,
        maxLength: validation.reasonForRejection.maxLength,
        default: "",
      },
    },
    // The start date of car rental
    startDate: {
      type: Date,
      required: true,
      trim: true,
    },
    // The end date of car rental
    endDate: {
      type: Date,
      required: true,
      trim: true,
    },
    noOfDays: {
      type: Number,
      required: true,
      min: validation.noOfDays.min,
      max: validation.noOfDays.max,
    },
    date: {
      type: Date,
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
  const noOfDaysInMilliseconds = 1000 * 60 * 60 * 24 * noOfDays;
  const endDate = new Date(startDate.getTime() + noOfDaysInMilliseconds);
  this.endDate = endDate;
};

rentOrderSchema.methods.calcTotalPrice = function (noOfDays, price) {
  try {
    const { daily, weekly, monthly, deposit } = price;

    let pricePerDay =
      noOfDays < 7 ? daily : noOfDays < 30 ? weekly / 7 : monthly / 30;

    const totalPrice = Math.ceil(noOfDays * pricePerDay + deposit);

    // Set total price and fatora payment gateway fees (%2.5)
    this.totalPrice = Math.ceil(totalPrice * 1.025);

    const appCommission = Math.ceil(totalPrice * 0.15);
    const officeBalance = totalPrice - appCommission;

    this.deservedAmount = {
      forAdmin: appCommission,
      forOffice: officeBalance,
    };
  } catch (err) {
    // Write error to the DB
  }
};

rentOrderSchema.methods.conflictsWith = function (order) {
  try {
    const thisStartDate = new Date(this.startDate);
    const thisEndDate = new Date(this.endDate);
    const thatStartDate = new Date(order.startDate);
    const thatEndDate = new Date(order.endDate);

    const startDateConflict =
      thatStartDate >= thisStartDate && thatStartDate <= thisEndDate;
    const endDateConflict =
      thatEndDate >= thisStartDate && thatEndDate <= thisEndDate;

    return startDateConflict || endDateConflict;
  } catch (err) {
    // Write error to the DB
    return true;
  }
};

// Order's status getter methods
rentOrderSchema.methods.isWaitingForApproval = function () {
  return this.status === "pending";
};

rentOrderSchema.methods.isWaitingForPayment = function () {
  return this.status === "approved";
};

rentOrderSchema.methods.isWaitingForDelivery = function () {
  return this.status === "paid";
};

rentOrderSchema.methods.isDelivered = function () {
  return this.status === "delivered";
};

rentOrderSchema.methods.isRejected = function () {
  return this.status === "rejected";
};

rentOrderSchema.methods.isClosed = function () {
  return this.status === "closed";
};

// Order's status setter methods
rentOrderSchema.methods.approve = function () {
  this.status = "approved";
};

rentOrderSchema.methods.pay = function () {
  this.status = "paid";
};

rentOrderSchema.methods.deliver = function () {
  this.status = "delivered";
};

rentOrderSchema.methods.reject = function () {
  this.status = "rejected";
};

rentOrderSchema.methods.close = function () {
  this.status = "closed";
};

rentOrderSchema.methods.addInvoiceURL = function (invoiceURL) {
  this.invoiceURL = invoiceURL;
};

// Creating the model
const RentOrder = model("RentOrder", rentOrderSchema);

// Exporting shared data about the model
module.exports = {
  RentOrder,
  CLIENT_SCHEMA,
};
