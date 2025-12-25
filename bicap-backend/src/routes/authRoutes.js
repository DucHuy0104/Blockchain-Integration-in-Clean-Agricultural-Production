// src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

const { verifyToken } = require('../middleware/authMiddleware');

// @route   POST /api/auth/sync-user
// @desc    Sync user from Firebase (Login/Register)
router.post('/sync-user', verifyToken, authController.syncUser);

// @route   GET /api/auth/me
// @desc    Get current user info
router.get('/me', verifyToken, authController.getMe);

module.exports = router;