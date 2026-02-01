// src/routes/publicRoutes.js
const express = require('express');
const router = express.Router();
const publicController = require('../controllers/publicController');
const { cacheMiddleware } = require('../config/redis');

// Tất cả routes đều public (không cần authentication)

// Marketplace - Sản phẩm - Cache 5 phút
router.get('/products', cacheMiddleware(300), publicController.getPublicProducts);
router.get('/products/:id', cacheMiddleware(600), publicController.getPublicProduct); // Cache 10 phút

// Truy xuất nguồn gốc
router.get('/traceability/:id', publicController.getTraceability); // Từ Season ID
router.get('/traceability/product/:id', publicController.getProductTraceability); // Từ Product ID

// Trang trại công khai
router.get('/farms', publicController.getPublicFarms);
router.get('/farms/:id', publicController.getPublicFarm);

module.exports = router;
