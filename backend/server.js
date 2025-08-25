require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const carRoutes = require("./routes/carRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// DB Connection
const MONGO_URI = process.env.MONGO_URI;
mongoose.connect(MONGO_URI, {
  dbName: 'car-rental',
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error("MongoDB Connection Error:", err));

// Routes
app.use("/api/cars", carRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

