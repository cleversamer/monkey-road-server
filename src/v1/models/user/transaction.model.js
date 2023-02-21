const { Schema, model, Types } = require("mongoose");
const { transaction: validation } = require("../../config/models");

// The data that will be received by the client side
const CLIENT_SCHEMA = [
  "_id",
  "author",
  "receiver",
  "order",
  "title",
  "status",
  "amount",
  "date",
];

// The default schema of the model
const transactionSchema = new Schema(
  {
    author: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    order: {
      type: Types.ObjectId,
      ref: "RentOrder",
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      minLength: validation.title.minLength,
      maxLength: validation.title.maxLength,
    },
    status: {
      type: String,
      required: true,
      trim: true,
      enum: validation.statuses,
      default: validation.statuses[0],
    },
    amount: {
      type: Number,
      required: true,
      min: validation.amount.min,
      max: validation.amount.max,
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

// Create an index to the `author` field to easily
// fetch user's transactions
transactionSchema.index({ author: 1 });

// Create an index to the `receiver` field to easily
// fetch office's transactions
transactionSchema.index({ receiver: 1 });

// Create an index to the `receiver` field to easily
// fetch office's transactions
transactionSchema.index({ status: 1 });

//////////////////// METHODS ////////////////////
transactionSchema.methods.complete = function () {
  try {
    this.status = "complete";
  } catch (err) {
    // Write error to the DB
  }
};

// Creating the model
const Transaction = model("Transaction", transactionSchema);

// Exporting shared data about the model
module.exports = {
  Transaction,
  CLIENT_SCHEMA,
};
