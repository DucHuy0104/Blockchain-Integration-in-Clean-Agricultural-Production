// src/routes/publicNotificationRoutes.js
const express = require('express');
const router = express.Router();
const publicNotificationController = require('../controllers/publicNotificationController');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');

// Public routes (không cần authentication)
router.get('/', publicNotificationController.getPublicNotifications);
router.get('/:id', publicNotificationController.getPublicNotificationById);

// Admin routes (cần authentication và role admin)
router.post('/', verifyToken, requireRole(['admin']), publicNotificationController.createPublicNotification);

module.exports = router;
