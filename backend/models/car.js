const mongoose = require("mongoose");

const carSchema = new mongoose.Schema(
  {
    make: { type: String, required: true }, // e.g. Toyota
    model: { type: String, required: true }, // e.g. Corolla
    manufactureYear: { type: Number, required: true }, // e.g. 2022
    licensePlate: { type: String, required: true, unique: true }, // unique identifier
    pricePerDay: { type: Number, required: true }, // rental price per day
    status: {
      type: String,
      enum: ["available", "rented", "maintenance"],
      default: "available",
    },
    images: {
      type: [String], // array of Cloudinary URLs
      validate: [(arr) => arr.length <= 10, "{PATH} exceeds 10 images"],
    },
  },
  { timestamps: true }
);

// Make `id` a virtual field for convenience
carSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

carSchema.set("toJSON", {
  virtuals: true,
});

module.exports = mongoose.model("Car", carSchema);

