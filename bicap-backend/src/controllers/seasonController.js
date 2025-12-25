// src/controllers/seasonController.js
const { FarmingSeason, FarmingProcess, Farm } = require('../models');
const blockchainHelper = require('../utils/blockchainHelper');

// @desc    Start a new Farming Season
// @route   POST /api/seasons
// @access  Private (Farm Owner)
exports.createSeason = async (req, res) => {
    try {
        const { name, startDate, endDate, farmId } = req.body;

        // 1. Verify ownership of the farm
        const farm = await Farm.findByPk(farmId);
        if (!farm) {
            return res.status(404).json({ message: 'Nông trại không tồn tại' });
        }

        // Check if the current user owns this farm
        if (farm.ownerId !== req.user.id) {
            return res.status(403).json({ message: 'Bạn không phải chủ sở hữu nông trại này' });
        }

        // 2. Create Season
        const newSeason = await FarmingSeason.create({
            name,
            startDate,
            endDate,
            farmId,
            status: 'active'
        });

        // 3. Log to Blockchain (Mock)
        const txHash = await blockchainHelper.writeToBlockchain({
            type: 'START_SEASON',
            seasonId: newSeason.id,
            farmId: farmId,
            startDate: startDate
        });

        // Update txHash in DB
        newSeason.txHash = txHash;
        await newSeason.save();

        res.status(201).json({
            message: 'Tạo mùa vụ thành công!',
            season: newSeason,
            txHash: txHash
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

// @desc    Add a Farming Process (Log Activity)
// @route   POST /api/seasons/:seasonId/process
// @access  Private (Farm Owner)
exports.addProcess = async (req, res) => {
    try {
        const { seasonId } = req.params;
        const { type, description, imageUrl } = req.body;

        // 1. Check Season existence
        const season = await FarmingSeason.findByPk(seasonId);
        if (!season) {
            return res.status(404).json({ message: 'Mùa vụ không tồn tại' });
        }

        // 2. Verify Ownership (via Farm)
        const farm = await Farm.findByPk(season.farmId);
        if (farm.ownerId !== req.user.id) {
            return res.status(403).json({ message: 'Bạn không có quyền thêm hoạt động vào mùa vụ này' });
        }

        // 3. Create Process Record
        const newProcess = await FarmingProcess.create({
            type, // e.g., 'watering', 'fertilizing', 'harvesting'
            description,
            imageUrl,
            seasonId
        });

        // 4. Log to Blockchain (Mock)
        const txHash = await blockchainHelper.writeToBlockchain({
            type: 'ADD_PROCESS',
            processId: newProcess.id,
            seasonId: seasonId,
            action: type,
            details: description
        });

        // Update txHash in DB
        newProcess.txHash = txHash;
        await newProcess.save();

        res.status(201).json({
            message: 'Ghi nhật ký hoạt động thành công!',
            process: newProcess,
            txHash: txHash
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

// @desc    Get all seasons for a specific farm
// @route   GET /api/seasons/farm/:farmId
exports.getSeasonsByFarm = async (req, res) => {
    try {
        const { farmId } = req.params;
        const seasons = await FarmingSeason.findAll({
            where: { farmId },
            include: [{ model: FarmingProcess, as: 'processes' }],
            order: [['createdAt', 'DESC']]
        });
        res.json(seasons);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};
