// src/routes/reportRoutes.js
const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');

router.post('/', verifyToken, reportController.createReport);
router.get('/', verifyToken, requireRole(['admin', 'farm']), reportController.getAllReports);

module.exports = router;
