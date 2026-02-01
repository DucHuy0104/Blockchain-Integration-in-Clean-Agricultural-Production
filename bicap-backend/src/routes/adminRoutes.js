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
router.get('/users/:id', adminAuth, adminController.getUserById);
router.put('/users/:id', adminAuth, adminController.updateUser);
router.delete('/users/:id', adminAuth, adminController.deleteUser);

// Farm Management
router.get('/farms', adminAuth, adminController.getFarms);
router.get('/farms/:id', adminAuth, adminController.getFarmById);
router.put('/farms/:id/approve', adminAuth, adminController.approveFarm);

// Report Management
router.get('/reports', adminAuth, adminController.getReports);
router.put('/reports/:id/status', adminAuth, adminController.updateReportStatus);

// Product Management
router.get('/products', adminAuth, adminController.getAllProducts);
router.put('/products/:id/status', adminAuth, adminController.updateProductStatus);

// Order Management
router.get('/orders', adminAuth, adminController.getAllOrders);

// Blockchain Management (Stubs)
router.get('/blockchain/status', adminAuth, (req, res) => res.json({ status: 'connected', network: 'VeChain Thor', contract: '0x123...abc' }));
router.post('/blockchain/deploy', adminAuth, (req, res) => res.json({ message: 'Deployment triggered', tx: '0xabc...123' }));

module.exports = router;

