// src/routes/shipmentRoutes.js
const express = require('express');
const router = express.Router();
const shipmentController = require('../controllers/shipmentController');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');
// --- QUAN TRỌNG NHẤT: Dòng này mở cổng cho /api/shipments ---
router.get('/', verifyToken, shipmentController.getAllShipments);

// Tạo vận đơn (Chủ trại)
router.post('/', verifyToken, requireRole(['farm', 'admin', 'shipping']), shipmentController.createShipment);

// Lấy danh sách vận đơn theo Farm (Chủ trại)
router.get('/farm/:farmId', verifyToken, requireRole(['farm', 'admin']), shipmentController.getShipmentsByFarm);

// MỚI: Lấy danh sách đơn hàng đã Confirm (chờ tạo Shipment)
router.get('/orders-ready', verifyToken, requireRole(['shipping', 'admin', 'farm']), shipmentController.getOrdersForShipping);

// Cập nhật trạng thái (Tài xế, Chủ trại)
router.put('/:id/status', verifyToken, shipmentController.updateShipmentStatus);

// MỚI: Hủy chuyến
router.put('/:id/cancel', verifyToken, requireRole(['shipping', 'admin', 'farm']), shipmentController.cancelShipment);

// MỚI: Gán tài xế
router.put('/:id/assign-driver', verifyToken, requireRole(['shipping', 'admin']), shipmentController.assignDriver);

module.exports = router;
