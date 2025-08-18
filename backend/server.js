const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const carRoutes = require("./routes/carRoutes");
const path = require("path");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
// app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // serve images

//// DB Connection
// mongoose.connect("mongodb://127.0.0.1:27017/carDB")
//  .then(() => console.log("MongoDB connected"))
//  .catch(err => console.error(err));

// DB Connection on MongoDb Atlas instead of localhost
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB Connected"))
.catch(err => console.error("MongoDB Connection Error:", err));


// Routes
app.use("/api/cars", carRoutes);

// Start server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

