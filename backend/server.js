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
const userRoutes = require('./Routes/usersRoutes');

// middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

// connect to db and start the server
ConnectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});

module.exports = app;

