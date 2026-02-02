// src/routes/retailerRoutes.js
const express = require('express');
const router = express.Router();
const retailerController = require('../controllers/retailerController');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');

// Tất cả routes yêu cầu authentication và role retailer
const retailerAuth = [verifyToken, requireRole(['retailer'])];

// Profile Management
router.get('/profile', retailerAuth, retailerController.getMyProfile);
router.put('/profile', retailerAuth, retailerController.updateProfile);

// Shipment Management (Retailer xem shipment của mình)
router.get('/shipments', retailerAuth, retailerController.getMyShipments);
router.get('/shipments/:id', retailerAuth, retailerController.getShipmentById);

module.exports = router;
