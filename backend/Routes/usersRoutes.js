const express = require('express');
const { getAllUsers, getUserProfile, updateUserProfile } = require('../controllers/usersController');
const { authenticate, authorize } = require("../middlewares/authMiddleware");

const router = express.Router();

// get all users
router.get("/all", authenticate, authorize, getAllUsers);

// get user profile by ID
router.get("/profile/:id", authenticate, getUserProfile);

// update user profile
router.put("/update/:id", authenticate, updateUserProfile);

module.exports = router;
