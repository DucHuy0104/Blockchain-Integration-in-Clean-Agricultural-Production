// src/routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');

// Tạo đơn hàng (Cho Retailer/User đã đăng nhập)
router.post('/', verifyToken, orderController.createOrder);

// Lấy danh sách đơn hàng của trang trại (Cho chủ trại)
router.get('/farm/:farmId', verifyToken, requireRole(['farm', 'admin']), orderController.getOrdersByFarm);

// Cập nhật trạng thái đơn hàng (Cho chủ trại)
router.put('/:id/status', verifyToken, requireRole(['farm', 'admin']), orderController.updateOrderStatus);

module.exports = router;
