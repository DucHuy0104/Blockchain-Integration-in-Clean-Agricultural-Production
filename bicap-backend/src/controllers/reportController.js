const { Report, User } = require('../models');

// @desc    Create a new report (Driver sending to Manager/Admin)
// @route   POST /api/reports
exports.createReport = async (req, res) => {
    try {
        const senderId = req.user.id;
        const { title, content, type, receiverRole } = req.body;

        const report = await Report.create({
            senderId,
            receiverRole: receiverRole || 'admin',
            title,
            content,
            type,
            status: 'pending'
        });

        res.status(201).json({ message: 'Gửi báo cáo thành công', report });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server khi gửi báo cáo' });
    }
};

// @desc    Get reports (Manager viewing)
// @route   GET /api/reports
exports.getReports = async (req, res) => {
    try {
        const userRole = req.user.role;

        let whereCondition = {};

        // If manager/admin, see reports sent to them
        if (['admin', 'shipping', 'manager'].includes(userRole)) {
            // Flexible logic: managers can see reports targeting them OR admin
            // Simplification: see all reports for now or filter by receiverRole
        } else {
            // Drivers only see their own reports
            whereCondition.senderId = req.user.id;
        }

        const reports = await Report.findAll({
            where: whereCondition,
            include: [{ model: User, as: 'sender', attributes: ['id', 'fullName', 'role'] }],
            order: [['createdAt', 'DESC']]
        });

        res.json(reports);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi lấy danh sách báo cáo' });
    }
};

// @desc    Update report status (Manager action)
// @route   PUT /api/reports/:id
exports.updateReport = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, adminNote } = req.body;

        const report = await Report.findByPk(id);
        if (!report) return res.status(404).json({ message: 'Báo cáo không tồn tại' });

        if (status) report.status = status;
        if (adminNote) report.adminNote = adminNote;

        await report.save();
        res.json({ message: 'Cập nhật báo cáo thành công', report });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi cập nhật báo cáo' });
    }
};
