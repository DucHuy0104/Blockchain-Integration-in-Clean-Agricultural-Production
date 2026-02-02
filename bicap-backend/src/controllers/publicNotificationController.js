// src/controllers/publicNotificationController.js
const { PublicNotification } = require('../models');
const { Op } = require('sequelize');

// 1. Lấy danh sách thông báo công khai (cho Guest)
exports.getPublicNotifications = async (req, res) => {
    try {
        const { category, limit = 20, offset = 0 } = req.query;

        const whereClause = {
            isActive: true,
            [Op.or]: [
                { publishedAt: { [Op.lte]: new Date() } },
                { publishedAt: null }
            ]
        };

        if (category) {
            whereClause.category = category;
        }

        const notifications = await PublicNotification.findAll({
            where: whereClause,
            order: [['publishedAt', 'DESC'], ['createdAt', 'DESC']],
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        res.json({ notifications });
    } catch (error) {
        console.error('Error getting public notifications:', error);
        res.status(500).json({ message: 'Lỗi lấy thông báo', error: error.message });
    }
};

// 2. Lấy chi tiết một thông báo công khai
exports.getPublicNotificationById = async (req, res) => {
    try {
        const { id } = req.params;

        const notification = await PublicNotification.findOne({
            where: {
                id,
                isActive: true
            }
        });

        if (!notification) {
            return res.status(404).json({ message: 'Thông báo không tồn tại' });
        }

        res.json({ notification });
    } catch (error) {
        console.error('Error getting notification:', error);
        res.status(500).json({ message: 'Lỗi lấy thông báo', error: error.message });
    }
};

// 3. Tạo thông báo công khai (Admin only - sẽ thêm vào adminController)
exports.createPublicNotification = async (req, res) => {
    try {
        const { title, message, type, category, imageUrl, linkUrl, publishedAt } = req.body;

        const notification = await PublicNotification.create({
            title,
            message,
            type: type || 'info',
            category,
            imageUrl,
            linkUrl,
            publishedAt: publishedAt || new Date(),
            isActive: true
        });

        res.status(201).json({
            message: 'Tạo thông báo thành công',
            notification
        });
    } catch (error) {
        console.error('Error creating notification:', error);
        res.status(500).json({ message: 'Lỗi tạo thông báo', error: error.message });
    }
};
