// src/routes/farmRoutes.js
const express = require('express');
const router = express.Router();
const farmController = require('../controllers/farmController');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');

// Chỉ cho phép "farm" (Chủ trại) hoặc "admin" tạo trang trại
router.post('/', verifyToken, requireRole(['farm', 'admin']), farmController.createFarm);

// Ai cũng có thể xem danh sách trang trại của chính mình (miễn là đã login)
router.get('/my-farms', verifyToken, requireRole(['farm', 'admin']), farmController.getMyFarms);

module.exports = router;