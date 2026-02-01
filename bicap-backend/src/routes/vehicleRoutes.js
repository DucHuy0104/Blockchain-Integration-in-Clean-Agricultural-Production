const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');

router.use(verifyToken);

router.get('/', requireRole(['shipping', 'admin', 'farm']), vehicleController.getVehicles);
router.post('/', requireRole(['shipping', 'admin', 'farm']), vehicleController.createVehicle);
router.put('/:id', requireRole(['shipping', 'admin', 'farm']), vehicleController.updateVehicle);
router.delete('/:id', requireRole(['shipping', 'admin', 'farm']), vehicleController.deleteVehicle);

module.exports = router;
