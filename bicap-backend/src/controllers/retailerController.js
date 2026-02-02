// src/controllers/retailerController.js
const { User, RetailerProfile, Order, Shipment, Product, Farm } = require('../models');

// 1. Lấy hoặc tạo RetailerProfile
exports.getMyProfile = async (req, res) => {
    try {
        const retailerId = req.user.id;

        let profile = await RetailerProfile.findOne({
            where: { retailerId },
            include: [{
                model: User,
                as: 'retailer',
                attributes: ['id', 'fullName', 'email', 'phone', 'address', 'businessLicense']
            }]
        });

        // Nếu chưa có profile, tạo mới
        if (!profile) {
            const user = await User.findByPk(retailerId);
            profile = await RetailerProfile.create({
                retailerId,
                businessName: user.fullName || '',
                businessLicenseNumber: user.businessLicense || null
            });
        }

        res.json({ profile });
    } catch (error) {
        console.error('Error getting retailer profile:', error);
        res.status(500).json({ message: 'Lỗi lấy thông tin profile', error: error.message });
    }
};

// 2. Cập nhật RetailerProfile
exports.updateProfile = async (req, res) => {
    try {
        const retailerId = req.user.id;
        const { businessName, businessLicenseNumber, businessAddress, taxCode, description } = req.body;

        let profile = await RetailerProfile.findOne({ where: { retailerId } });

        if (!profile) {
            // Tạo mới nếu chưa có
            profile = await RetailerProfile.create({
                retailerId,
                businessName,
                businessLicenseNumber,
                businessAddress,
                taxCode,
                description
            });
        } else {
            // Cập nhật
            if (businessName !== undefined) profile.businessName = businessName;
            if (businessLicenseNumber !== undefined) profile.businessLicenseNumber = businessLicenseNumber;
            if (businessAddress !== undefined) profile.businessAddress = businessAddress;
            if (taxCode !== undefined) profile.taxCode = taxCode;
            if (description !== undefined) profile.description = description;

            await profile.save();
        }

        // Cập nhật businessLicense trong User table nếu có
        if (businessLicenseNumber) {
            const user = await User.findByPk(retailerId);
            if (user) {
                user.businessLicense = businessLicenseNumber;
                await user.save();
            }
        }

        res.json({
            message: 'Cập nhật thông tin thành công',
            profile
        });
    } catch (error) {
        console.error('Error updating retailer profile:', error);
        res.status(500).json({ message: 'Lỗi cập nhật thông tin', error: error.message });
    }
};

// 3. Lấy danh sách shipment của Retailer (theo orders)
exports.getMyShipments = async (req, res) => {
    try {
        const retailerId = req.user.id;

        // Lấy tất cả orders của retailer
        const orders = await Order.findAll({
            where: { retailerId },
            include: [
                {
                    model: Shipment,
                    as: 'shipment',
                    include: [
                        {
                            model: User,
                            as: 'driver',
                            attributes: ['id', 'fullName', 'phone']
                        },
                        {
                            model: User,
                            as: 'manager',
                            attributes: ['id', 'fullName', 'phone']
                        }
                    ]
                },
                {
                    model: Product,
                    as: 'product',
                    include: [{
                        model: Farm,
                        as: 'farm',
                        attributes: ['id', 'name', 'address']
                    }]
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        // Lọc ra các orders có shipment
        const shipments = orders
            .filter(order => order.shipment)
            .map(order => ({
                ...order.shipment.toJSON(),
                order: {
                    id: order.id,
                    product: order.product,
                    quantity: order.quantity,
                    totalPrice: order.totalPrice,
                    status: order.status
                }
            }));

        res.json({ shipments });
    } catch (error) {
        console.error('Error getting retailer shipments:', error);
        res.status(500).json({ message: 'Lỗi lấy danh sách vận chuyển', error: error.message });
    }
};

// 4. Lấy chi tiết một shipment của Retailer
exports.getShipmentById = async (req, res) => {
    try {
        const { id } = req.params;
        const retailerId = req.user.id;

        const shipment = await Shipment.findOne({
            where: { id },
            include: [
                {
                    model: Order,
                    as: 'order',
                    where: { retailerId },
                    include: [
                        {
                            model: Product,
                            as: 'product',
                            include: [{
                                model: Farm,
                                as: 'farm',
                                attributes: ['id', 'name', 'address']
                            }]
                        }
                    ]
                },
                {
                    model: User,
                    as: 'driver',
                    attributes: ['id', 'fullName', 'phone']
                },
                {
                    model: User,
                    as: 'manager',
                    attributes: ['id', 'fullName', 'phone']
                }
            ]
        });

        if (!shipment) {
            return res.status(404).json({ message: 'Vận đơn không tồn tại hoặc bạn không có quyền' });
        }

        res.json({ shipment });
    } catch (error) {
        console.error('Error getting shipment:', error);
        res.status(500).json({ message: 'Lỗi lấy thông tin vận đơn', error: error.message });
    }
};
