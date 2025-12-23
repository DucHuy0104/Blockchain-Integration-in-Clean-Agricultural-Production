// src/routes/productRoutes.js
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { protect } = require('../middlewares/authMiddleware');

// Tạo sản phẩm (Cần login)
router.post('/', protect, productController.createProduct);

// Xem sản phẩm của một trang trại cụ thể
router.get('/farm/:farmId', protect, productController.getProductsByFarm);

module.exports = router;