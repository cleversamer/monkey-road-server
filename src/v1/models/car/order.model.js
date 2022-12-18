const { Schema, model, Types } = require("mongoose");
const { order: validation } = require("../../middleware/validation/models");

// The data that will be received by the client side
const CLIENT_SCHEMA = ["_id", "author", "date", "status"];

// The default schema of the model
const rentCarOrderSchema = new Schema(
  {
    author: {
      name: {
        type: String,
        requied: true,
      },
      ref: {
        type: Types.ObjectId,
        required: true,
        ref: "User",
      },
    },
    date: {
      type: String,
      required: true,
      trim: true,
      default: new Date(),
    },
    status: {
      en: {
        type: String,
        required: true,
        default: "pending",
        trim: true,
        enum: validation.status.en,
      },
      ar: {
        type: String,
        required: true,
        default: "pending",
        trim: true,
        enum: validation.status.ar,
      },
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

// Creating the model
const RentCarOrder = model("RentCarOrder", rentCarOrderSchema);

// Exporting shared data about the model
module.exports = {
  RentCarOrder,
  CLIENT_SCHEMA,
  SUPPORTED_ROLES,
};
