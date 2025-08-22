require('dotenv').config();
const express = require('express')
const cors = require('cors')
const app = express()

// environment variables import
const PORT = process.env.PORT || 5000;

// db connection import
const ConnectDB = require('./config/db');

// routes import
const authRoutes = require('./Routes/authRoutes')
const userRoutes = require('./Routes/userRoutes');

// middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || 'Server Error',
  });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  // Close server & exit process
  process.exit(1);
});

// connect to db and start the server
ConnectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});

module.exports = app;

