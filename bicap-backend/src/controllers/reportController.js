// src/controllers/reportController.js
const { Report, User } = require('../models');

// 1. Tạo báo cáo (Retailer/Driver gửi báo cáo sự cố)
exports.createReport = async (req, res) => {
    try {
        const { title, content, type } = req.body;

        let senderId;
        if (req.user) {
            senderId = req.user.id;
        } else if (req.userFirebase) {
            const user = await User.findOne({ where: { firebaseUid: req.userFirebase.uid } });
            if (!user) return res.status(404).json({ message: 'User not found' });
            senderId = user.id;
        } else {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const report = await Report.create({
            senderId,
            title,
            content,
            type // incident, feedback, other
        });

        res.status(201).json({ message: 'Gửi báo cáo thành công', report });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi gửi báo cáo' });
    }
};

// 2. Lấy danh sách báo cáo (Admin/Farm xem - ở đây logic đơn giản lấy toàn bộ hoặc theo filter)
exports.getAllReports = async (req, res) => {
    try {
        const reports = await Report.findAll({
            include: [{ model: User, as: 'sender', attributes: ['fullName', 'email', 'role'] }],
            order: [['createdAt', 'DESC']]
        });
        res.json({ reports });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi lấy danh sách báo cáo' });
    }
};
