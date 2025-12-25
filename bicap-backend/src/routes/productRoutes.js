// src/routes/productRoutes.js
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');

// Tạo sản phẩm (Chỉ chủ trại)
router.post('/', verifyToken, requireRole(['farm', 'admin']), productController.createProduct);

// Xem sản phẩm của một trang trại cụ thể (Công khai hoặc cần login tùy logic, ở đây để cần login cho chắc)
router.get('/farm/:farmId', verifyToken, productController.getProductsByFarm);

module.exports = router;