const { Schema, model } = require("mongoose");
const { brand: validation } = require("../../config/models");

// The data that will be received by the client side
const CLIENT_SCHEMA = ["_id", "name", "photoURL"];

// The default schema of the model
const brandSchema = new Schema(
  {
    // The name of the brand
    name: {
      en: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        minLength: validation.name.minLength,
        maxLength: validation.name.maxLength,
      },
      ar: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        minLength: validation.name.minLength,
        maxLength: validation.name.maxLength,
      },
    },
    // Number of purchase/rent cars added with this brand
    noOfCars: {
      type: Number,
      default: 0,
    },
    // The photo URL of the brand
    photoURL: {
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

// Creating the model
const Brand = model("Brand", brandSchema);

// Exporting shared data about the model
module.exports = {
  Brand,
  CLIENT_SCHEMA,
};
