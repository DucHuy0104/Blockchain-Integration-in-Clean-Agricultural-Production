// src/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');

// Tất cả routes đều yêu cầu authentication và role admin
const adminAuth = [verifyToken, requireRole(['admin'])];

// Dashboard
router.get('/dashboard', adminAuth, adminController.getDashboard);

// User Management
router.get('/users', adminAuth, adminController.getUsers);
router.post('/users', adminAuth, adminController.createUser);
router.get('/users/:id', adminAuth, adminController.getUserById);
router.put('/users/:id', adminAuth, adminController.updateUser);
router.delete('/users/:id', adminAuth, adminController.deleteUser);

// Farm Management
router.get('/farms', adminAuth, adminController.getFarms);
router.get('/farms/:id', adminAuth, adminController.getFarmById);
router.put('/farms/:id/approve', adminAuth, adminController.approveFarm);
router.delete('/farms/:id', adminAuth, adminController.deleteFarm);

// Report Management
router.get('/reports', adminAuth, adminController.getReports);
router.put('/reports/:id/status', adminAuth, adminController.updateReportStatus);

router.get('/products', adminAuth, adminController.getAllProducts);
router.put('/products/:id', adminAuth, adminController.updateProduct);
router.put('/products/:id/status', adminAuth, adminController.updateProductStatus);

// Order Management
router.get('/orders', adminAuth, adminController.getAllOrders);

// Blockchain Management
router.get('/blockchain/status', adminAuth, adminController.getBlockchainStatus);
router.post('/blockchain/deploy', adminAuth, adminController.deployContract);

// Public Notifications Management
router.get('/public-notifications', adminAuth, adminController.getPublicNotifications);
router.put('/public-notifications/:id', adminAuth, adminController.updatePublicNotification);
router.delete('/public-notifications/:id', adminAuth, adminController.deletePublicNotification);

module.exports = router;

