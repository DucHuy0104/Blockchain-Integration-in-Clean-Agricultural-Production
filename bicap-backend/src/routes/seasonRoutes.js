const express = require('express');
const router = express.Router();
const seasonController = require('../controllers/seasonController');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');

// Create Season (Farm Owner Only)
router.post('/', verifyToken, requireRole(['farm', 'admin']), seasonController.createSeason);

// Add Process to Season (Farm Owner Only)
router.post('/:seasonId/process', verifyToken, requireRole(['farm', 'admin']), seasonController.addProcess);

// Export Season (Farm Owner Only)
router.post('/:seasonId/export', verifyToken, requireRole(['farm', 'admin']), seasonController.exportSeason);

// Get Seasons for valid Farm (Public or Private depending on logic, let's keep it protected for now or open if Guest needs to see)
// For now, let's allow anyone to see seasons of a farm (Traceability)
router.get('/farm/:farmId', seasonController.getSeasonsByFarm);

// Get Season Details (Public or Private)
router.get('/:seasonId', seasonController.getSeasonById);

module.exports = router;
