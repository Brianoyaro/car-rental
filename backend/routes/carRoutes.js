const express = require("express");
const router = express.Router();
const Car = require("../models/Car");
const upload = require("../middleware/cloudinary"); // multer-cloudinary config

// Upload a car (with a maximum of 10 images)
router.post("/", upload.array("images", 10), async (req, res) => {
  try {
    const { make, model, manufactureYear, licensePlate, pricePerDay, status } = req.body;

    // Cloudinary file paths
    const imageUrls = req.files.map((file) => file.path);

    const newCar = new Car({
      make,
      model,
      manufactureYear,
      licensePlate,
      pricePerDay,
      status: status || "available", // default if not provided
      images: imageUrls,
    });

    const savedCar = await newCar.save();
    res.status(201).json(savedCar);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all cars
router.get("/", async (req, res) => {
  try {
    const cars = await Car.find().sort({ createdAt: -1 });
    res.json(cars);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

