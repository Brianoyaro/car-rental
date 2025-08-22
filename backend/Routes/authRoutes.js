const express = require('express');
const { registerUser, loginUser, logoutUser, adminLogin, adminSignUp } = require('../controllers/authController');
const { authenticate } = require('../middlewares/authMiddleware');
const router = express.Router();

// authentication routes

// register
router.post("/register", registerUser);

// login
router.post("/login", loginUser);

// logout user
router.post("/logout", authenticate, logoutUser);

// admin registration
router.post("/admin/signup", adminSignUp);

// admin login
router.post("/admin/login", adminLogin);

module.exports = router;
