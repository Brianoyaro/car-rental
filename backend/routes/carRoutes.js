const express = require("express");
const router = express.Router();
const Car = require("../models/car");
const upload = require("../middleware/cloudinary"); // multer-cloudinary config

// =======================
// Cars API
// =======================

// GET /api/cars - Get list of cars (available & rented)
router.get("/", async (req, res) => {
  try {
    const cars = await Car.find().sort({ createdAt: -1 });
    console.log(cars);
    res.json(cars);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/cars/:id - Get car details
router.get("/:id", async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ error: "Car not found" });
    console.log(car);
    res.json(car);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/cars - Add new car to inventory (Admin only)
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
      status: status || "available",
      images: imageUrls,
    });

    const savedCar = await newCar.save();
    console.log(savedCar);
    res.status(201).json(savedCar);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/cars/:id - Update car info (Admin only)
router.put("/:id", upload.array("images", 10), async (req, res) => {
  try {
    const { make, model, manufactureYear, licensePlate, pricePerDay, status } = req.body;

    let updateData = {
      make,
      model,
      manufactureYear,
      licensePlate,
      pricePerDay,
      status,
    };

    // if images uploaded, update them
    if (req.files && req.files.length > 0) {
      updateData.images = req.files.map((file) => file.path);
    }

    const updatedCar = await Car.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!updatedCar) return res.status(404).json({ error: "Car not found" });

    console.log(updatedCar);
    res.json(updatedCar);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/cars/:id - Remove car (Admin only)
router.delete("/:id", async (req, res) => {
  try {
    const deletedCar = await Car.findByIdAndDelete(req.params.id);
    if (!deletedCar) return res.status(404).json({ error: "Car not found" });

    res.json({ message: "Car removed successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
