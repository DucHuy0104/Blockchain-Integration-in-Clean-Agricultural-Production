const { Vehicle, User } = require('../models');

// @desc    Get all vehicles (owned by manager)
// @route   GET /api/vehicles
exports.getVehicles = async (req, res) => {
    try {
        const { id, role } = req.user;

        let whereClause = { ownerId: id };
        // Admin và Shipping Manager có quyền xem toàn bộ đội xe
        if (role === 'admin' || role === 'shipping') {
            whereClause = {};
        }

        const vehicles = await Vehicle.findAll({
            where: whereClause,
            include: [{ model: User, as: 'driver', attributes: ['id', 'fullName', 'phone'] }],
            order: [['createdAt', 'DESC']]
        });
        res.json(vehicles);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server khi lấy danh sách xe' });
    }
};

// @desc    Create new vehicle
// @route   POST /api/vehicles
exports.createVehicle = async (req, res) => {
    try {
        const ownerId = req.user.id;
        const { licensePlate, vehicleType, capacity, notes } = req.body;

        const existingVehicle = await Vehicle.findOne({ where: { licensePlate } });
        if (existingVehicle) {
            return res.status(400).json({ message: 'Biển số xe đã tồn tại' });
        }

        const newVehicle = await Vehicle.create({
            ownerId,
            licensePlate,
            vehicleType,
            capacity,
            notes,
            status: 'available'
        });

        res.status(201).json({ message: 'Thêm phương tiện thành công', vehicle: newVehicle });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server khi thêm xe', error: error.message });
    }
};

// @desc    Update vehicle
// @route   PUT /api/vehicles/:id
exports.updateVehicle = async (req, res) => {
    try {
        const { id } = req.params;
        const { vehicleType, capacity, status, notes, driverId } = req.body;

        const vehicle = await Vehicle.findByPk(id);
        if (!vehicle) return res.status(404).json({ message: 'Xe không tồn tại' });

        // Update fields
        if (vehicleType) vehicle.vehicleType = vehicleType;
        if (capacity) vehicle.capacity = capacity;
        if (status) vehicle.status = status;
        if (notes) vehicle.notes = notes;

        // Handle driver assignment
        if (driverId !== undefined) {
            vehicle.driverId = driverId || null;
            // If assigned to driver, set status to busy or available depending on logic
            // simple logic: just assign
        }

        await vehicle.save();
        res.json({ message: 'Cập nhật xe thành công', vehicle });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi cập nhật xe' });
    }
};

// @desc    Delete vehicle
// @route   DELETE /api/vehicles/:id
exports.deleteVehicle = async (req, res) => {
    try {
        const { id } = req.params;
        const vehicle = await Vehicle.findByPk(id);

        if (!vehicle) return res.status(404).json({ message: 'Xe không tồn tại' });

        await vehicle.destroy();
        res.json({ message: 'Xóa phương tiện thành công' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi xóa phương tiện' });
    }
};
