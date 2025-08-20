const express = require('express');
const { getAllUsers, getUserProfile, updateUserProfile, deleteUser } = require('../controllers/usersController');
const { authenticate, authorize } = require("../middlewares/authMiddleware");

const router = express.Router();

// get all users authorized to admin only
router.get("/all", authenticate, authorize(["admin"]), getAllUsers);

// delete user authorized to admin only
router.delete("/delete", authenticate, authorize(["admin"]), deleteUser);

// get user profile by ID
router.get("/profile/:id", authenticate, getUserProfile);

// update user profile
router.put("/update/:id", authenticate, updateUserProfile);

module.exports = router;
