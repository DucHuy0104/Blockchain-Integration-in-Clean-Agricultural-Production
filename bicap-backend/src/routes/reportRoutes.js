const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');

router.use(verifyToken);

router.post('/', reportController.createReport);
router.get('/', reportController.getReports);
router.put('/:id', requireRole(['admin', 'shipping', 'manager']), reportController.updateReport);

module.exports = router;
