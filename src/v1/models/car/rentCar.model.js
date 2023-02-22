const { Schema, model, Types } = require("mongoose");
const CARS = require("../../data/cars");
const { rentCar: validation } = require("../../config/models");

// The data that will be received by the client side
const CLIENT_SCHEMA = [
  "_id",
  "office",
  "name",
  "model",
  "color",
  "brand",
  "year",
  "price",
  "description",
  "photos",
  "accepted",
  "creationDate",
];

// The default schema of the model
const rentCarSchema = new Schema(
  {
    // To figure out which office has posted this car
    office: {
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
    // The name of the car
    name: {
      type: String,
      required: true,
      trim: true,
      minLength: validation.name.minLength,
      maxLength: validation.name.maxLength,
    },
    // The model of the car
    model: {
      type: String,
      required: true,
      trim: true,
      minLength: validation.model.minLength,
      maxLength: validation.model.maxLength,
    },
    // The color of the car
    color: {
      en: {
        type: String,
        required: true,
        trim: true,
        enum: CARS.COLORS.EN,
      },
      ar: {
        type: String,
        required: true,
        trim: true,
        enum: CARS.COLORS.AR,
      },
    },
    // The brand/manufacturer of the car
    brand: {
      name: {
        en: {
          type: String,
          required: true,
        },
        ar: {
          type: String,
          required: true,
        },
      },
      ref: {
        type: Types.ObjectId,
        required: true,
        ref: "Brand",
      },
    },
    // The car's release date
    year: {
      type: String,
      required: true,
      trim: true,
      enum: CARS.YEARS,
    },
    // Rent prices & deposit
    price: {
      daily: {
        type: Number,
        required: true,
        default: validation.price.daily.min,
        min: validation.price.daily.min,
        max: validation.price.daily.max,
      },
      weekly: {
        type: Number,
        required: true,
        min: validation.price.weekly.min,
        max: validation.price.weekly.max,
      },
      monthly: {
        type: Number,
        required: true,
        min: validation.price.monthly.min,
        max: validation.price.monthly.max,
      },
      deposit: {
        type: Number,
        required: true,
        default: validation.price.deposit.default,
        min: validation.price.deposit.min,
        max: validation.price.deposit.max,
      },
    },
    // The description of the car
    description: {
      type: String,
      required: false,
      trim: true,
      minLength: validation.description.minLength,
      maxLength: validation.description.maxLength,
    },
    // The photos of the car
    photos: {
      type: Array,
      required: true,
      min: validation.photos.min,
      max: validation.photos.max,
    },
    // Means that rent car is accepted by admin or not
    accepted: {
      type: Boolean,
      default: false,
    },
    archived: {
      type: Boolean,
      default: false,
    },
    // The date of adding this car
    creationDate: {
      type: Date,
      required: true,
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

// Because the office needs to read its rental cars
// and this process will happen a lot in the application
// and we can not let mongodb to do a COLLSACAN
rentCarSchema.index({ "office.ref": 1 });

// Creating a text index based on multiple fields to enhance
// search alogrithms and reach more relevant search results.
rentCarSchema.index({
  name: "text",
  "office.name": "text",
  model: "text",
  "brand.name.ar": "text",
  "color.ar": "text",
  year: "text",
  description: "text",
});

// Rent car methods
rentCarSchema.methods.archive = function () {
  try {
    this.archived = true;
  } catch (err) {
    // TODO: write error to the DB
  }
};

rentCarSchema.methods.restore = function () {
  try {
    this.archived = false;
  } catch (err) {
    // Write error to the DB
  }
};

rentCarSchema.methods.isArchived = function () {
  try {
    return this.archived;
  } catch (err) {
    // TODO: write error to the DB
  }
};

rentCarSchema.methods.accept = function () {
  try {
    this.accepted = true;
  } catch (err) {
    // Write error to the DB
  }
};

// Creating the model
const RentCar = model("RentCar", rentCarSchema);

// Exporting shared data about the model
module.exports = {
  RentCar,
  CLIENT_SCHEMA,
};
