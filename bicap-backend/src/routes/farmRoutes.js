// src/routes/farmRoutes.js
const express = require('express');
const router = express.Router();
const farmController = require('../controllers/farmController');
const { protect } = require('../middlewares/authMiddleware');

// Yêu cầu phải có Token (protect) mới được gọi các API này
router.post('/', protect, farmController.createFarm);
router.get('/my-farms', protect, farmController.getMyFarms);

module.exports = router;