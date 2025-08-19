const express = require('express');
const { registerUser, loginUser, logoutUser } = require('../controllers/authController');
const { authenticate } = require('../middleware/authMiddleware');
const router = express.Router();

// authentication routes

// register
router.post("/register", registerUser);

// login
router.post("/login", loginUser);

// logout user
router.post("/logout", authenticate, logoutUser);

module.exports = router;