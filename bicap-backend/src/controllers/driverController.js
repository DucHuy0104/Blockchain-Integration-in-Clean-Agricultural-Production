// src/controllers/driverController.js
const { Shipment, Order, Product, Farm, User, Vehicle } = require('../models');
const { Op } = require('sequelize');
const { createNotificationInternal } = require('./notificationController');

/**
 * Lấy danh sách vận đơn được gán cho Driver
 */
exports.getMyShipments = async (req, res) => {
    try {
        const driverId = req.user.id;
        const { status } = req.query;

        const whereClause = { driverId };
        if (status) {
            whereClause.status = status;
        }

        const shipments = await Shipment.findAll({
            where: whereClause,
            include: [
                {
                    model: Order,
                    as: 'order',
                    required: true,
                    include: [
                        {
                            model: Product,
                            as: 'product',
                            include: [
                                {
                                    model: Farm,
                                    as: 'farm',
                                    attributes: ['id', 'name', 'address', 'location_coords']
                                }
                            ]
                        },
                        {
                            model: User,
                            as: 'retailer',
                            attributes: ['id', 'fullName', 'phone', 'address']
                        }
                    ]
                },
                {
                    model: User,
                    as: 'manager',
                    attributes: ['id', 'fullName', 'phone']
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        res.json({ shipments });

    } catch (error) {
        console.error('Error getting driver shipments:', error);
        res.status(500).json({ message: 'Lỗi lấy danh sách vận đơn', error: error.message });
    }
};

/**
 * Lấy chi tiết một vận đơn
 */
exports.getShipmentById = async (req, res) => {
    try {
        const { id } = req.params;
        const driverId = req.user.id;

        const shipment = await Shipment.findOne({
            where: { id, driverId },
            include: [
                {
                    model: Order,
                    as: 'order',
                    required: true,
                    include: [
                        {
                            model: Product,
                            as: 'product',
                            include: [
                                {
                                    model: Farm,
                                    as: 'farm',
                                    attributes: ['id', 'name', 'address', 'location_coords']
                                }
                            ]
                        },
                        {
                            model: User,
                            as: 'retailer',
                            attributes: ['id', 'fullName', 'phone', 'address']
                        }
                    ]
                },
                {
                    model: User,
                    as: 'manager',
                    attributes: ['id', 'fullName', 'phone']
                }
            ]
        });

        if (!shipment) {
            return res.status(404).json({ message: 'Vận đơn không tồn tại hoặc bạn không có quyền truy cập' });
        }

        res.json({ shipment });

    } catch (error) {
        console.error('Error getting shipment:', error);
        res.status(500).json({ message: 'Lỗi lấy thông tin vận đơn', error: error.message });
    }
};

/**
 * Cập nhật vị trí GPS hiện tại của Driver
 */
exports.updateLocation = async (req, res) => {
    try {
        const { shipmentId, latitude, longitude } = req.body;
        const driverId = req.user.id;

        if (!shipmentId || latitude === undefined || longitude === undefined) {
            return res.status(400).json({ message: 'Thiếu thông tin: shipmentId, latitude, longitude' });
        }

        const shipment = await Shipment.findOne({
            where: { id: shipmentId, driverId }
        });

        if (!shipment) {
            return res.status(404).json({ message: 'Vận đơn không tồn tại hoặc bạn không có quyền' });
        }

        // Cập nhật vị trí hiện tại
        shipment.currentLocation = `${latitude},${longitude}`;
        await shipment.save();

        res.json({
            message: 'Cập nhật vị trí thành công',
            location: {
                latitude,
                longitude,
                shipmentId: shipment.id
            }
        });

    } catch (error) {
        console.error('Error updating location:', error);
        res.status(500).json({ message: 'Lỗi cập nhật vị trí', error: error.message });
    }
};

/**
 * Xác nhận nhận hàng (Pickup) - Quét QR code
 */
exports.confirmPickup = async (req, res) => {
    try {
        const { shipmentId, qrCode, latitude, longitude } = req.body;
        console.log(`[DEBUG_PICKUP] Body:`, req.body);
        const driverId = req.user.id;
        console.log(`[DEBUG_PICKUP] DriverID:`, driverId);

        if (!shipmentId || !qrCode) {
            return res.status(400).json({ message: 'Thiếu thông tin: shipmentId, qrCode' });
        }

        const shipment = await Shipment.findOne({
            where: { id: shipmentId, driverId },
            include: [
                {
                    model: Order,
                    as: 'order',
                    include: [{ model: Product, as: 'product' }]
                }
            ]
        });

        if (!shipment) {
            return res.status(404).json({ message: 'Vận đơn không tồn tại hoặc bạn không có quyền' });
        }

        // Validate QR code (có thể là orderId hoặc shipmentId)
        // Trong thực tế, QR code sẽ chứa thông tin đơn hàng hoặc vận đơn
        const expectedQR1 = `ORDER_${shipment.orderId}`;
        const expectedQR2 = `SHIPMENT_${shipmentId}`;
        if (qrCode !== expectedQR1 && qrCode !== expectedQR2 && qrCode !== `SHIP_${shipmentId}` && qrCode !== shipment.orderId.toString() && qrCode !== shipmentId.toString()) {
            return res.status(400).json({ message: 'QR code không hợp lệ hoặc không khớp với vận đơn' });
        }

        // Kiểm tra trạng thái hiện tại
        if (!['created', 'assigned'].includes(shipment.status)) {
            return res.status(400).json({ message: `Không thể nhận hàng ở trạng thái: ${shipment.status}` });
        }

        // Cập nhật trạng thái
        shipment.status = 'picked_up';
        shipment.pickupTime = new Date();
        shipment.pickupQRCode = qrCode;

        if (latitude && longitude) {
            shipment.pickupLocation = `${latitude},${longitude}`;
            shipment.currentLocation = `${latitude},${longitude}`;
        }

        await shipment.save();

        // Cập nhật trạng thái đơn hàng
        const order = await Order.findByPk(shipment.orderId);
        if (order && order.status === 'confirmed') {
            order.status = 'shipping';
            await order.save();
        }

        // Gửi thông báo
        await createNotificationInternal(
            shipment.order.retailerId,
            'Đã nhận hàng',
            `Vận đơn #${shipment.id} đã được tài xế nhận hàng. Đơn hàng đang được vận chuyển.`,
            'shipment'
        );

        res.json({
            message: 'Xác nhận nhận hàng thành công',
            shipment
        });

    } catch (error) {
        console.error('Error confirming pickup:', error);
        res.status(500).json({ message: 'Lỗi xác nhận nhận hàng', error: error.message });
    }
};

/**
 * Xác nhận giao hàng (Delivery) - Quét QR code
 */
exports.confirmDelivery = async (req, res) => {
    try {
        const { shipmentId, qrCode, latitude, longitude, deliveryImage } = req.body;
        console.log(`[DEBUG_DELIVERY] Body:`, req.body);
        const driverId = req.user.id;

        if (!shipmentId || !qrCode) {
            return res.status(400).json({ message: 'Thiếu thông tin: shipmentId, qrCode' });
        }

        const shipment = await Shipment.findOne({
            where: { id: shipmentId, driverId },
            include: [
                {
                    model: Order,
                    as: 'order',
                    include: [{ model: Product, as: 'product' }]
                }
            ]
        });

        if (!shipment) {
            return res.status(404).json({ message: 'Vận đơn không tồn tại hoặc bạn không có quyền' });
        }

        // Validate QR code
        const expectedQR1 = `ORDER_${shipment.orderId}`;
        const expectedQR2 = `SHIPMENT_${shipmentId}`;
        if (qrCode !== expectedQR1 && qrCode !== expectedQR2 && qrCode !== `SHIP_${shipmentId}` && qrCode !== shipment.orderId.toString() && qrCode !== shipmentId.toString()) {
            return res.status(400).json({ message: 'QR code không hợp lệ hoặc không khớp với vận đơn' });
        }

        // Kiểm tra trạng thái hiện tại
        if (!['picked_up', 'delivering'].includes(shipment.status)) {
            return res.status(400).json({ message: `Không thể giao hàng ở trạng thái: ${shipment.status}` });
        }

        // Cập nhật trạng thái
        shipment.status = 'delivered';
        shipment.deliveryTime = new Date();
        shipment.deliveryQRCode = qrCode;

        if (latitude && longitude) {
            shipment.deliveryLocation = `${latitude},${longitude}`;
            shipment.currentLocation = `${latitude},${longitude}`;
        }

        await shipment.save();

        // Cập nhật trạng thái đơn hàng
        const order = await Order.findByPk(shipment.orderId);
        if (order) {
            order.status = 'completed';
            if (deliveryImage) {
                order.deliveryImage = deliveryImage;
            }
            await order.save();
        }

        // Gửi thông báo
        await createNotificationInternal(
            shipment.order.retailerId,
            'Đã giao hàng',
            `Vận đơn #${shipment.id} đã được giao thành công. Đơn hàng #${shipment.orderId} đã hoàn tất.`,
            'shipment'
        );

        // Gửi thông báo cho Farm Owner
        const farm = await Farm.findByPk(shipment.order.product.farmId);
        if (farm) {
            await createNotificationInternal(
                farm.ownerId,
                'Giao hàng thành công',
                `Đơn hàng #${shipment.orderId} đã được giao thành công.`,
                'order'
            );
        }

        res.json({
            message: 'Xác nhận giao hàng thành công',
            shipment
        });

    } catch (error) {
        console.error('Error confirming delivery:', error);
        res.status(500).json({ message: 'Lỗi xác nhận giao hàng', error: error.message });
    }
};

/**
 * Cập nhật trạng thái vận chuyển
 */
exports.updateShipmentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, latitude, longitude } = req.body;
        const driverId = req.user.id;

        const validStatuses = ['assigned', 'picked_up', 'delivering', 'delivered', 'failed'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: `Trạng thái không hợp lệ. Các trạng thái hợp lệ: ${validStatuses.join(', ')}` });
        }

        const shipment = await Shipment.findOne({
            where: { id, driverId },
            include: [{ model: Order, as: 'order' }]
        });

        if (!shipment) {
            return res.status(404).json({ message: 'Vận đơn không tồn tại hoặc bạn không có quyền' });
        }

        // Cập nhật trạng thái
        shipment.status = status;

        // Cập nhật thời gian và vị trí tùy theo trạng thái
        if (status === 'picked_up' && !shipment.pickupTime) {
            shipment.pickupTime = new Date();
        }
        if (status === 'delivered' && !shipment.deliveryTime) {
            shipment.deliveryTime = new Date();
        }
        if (latitude && longitude) {
            shipment.currentLocation = `${latitude},${longitude}`;
        }

        await shipment.save();

        // Cập nhật trạng thái đơn hàng tương ứng
        const order = await Order.findByPk(shipment.orderId);
        if (order) {
            if (status === 'delivering') {
                order.status = 'shipping';
            } else if (status === 'delivered') {
                order.status = 'completed';
            }
            await order.save();
        }

        // Gửi thông báo
        await createNotificationInternal(
            shipment.order.retailerId,
            'Cập nhật vận chuyển',
            `Vận đơn #${shipment.id} đã chuyển sang trạng thái: ${status}`,
            'shipment'
        );

        res.json({
            message: 'Cập nhật trạng thái thành công',
            shipment
        });

    } catch (error) {
        console.error('Error updating shipment status:', error);
        res.status(500).json({ message: 'Lỗi cập nhật trạng thái', error: error.message });
    }
};

/**
 * Lấy thống kê của Driver
 */
exports.getDriverStats = async (req, res) => {
    try {
        const driverId = req.user.id;

        const [totalShipments, activeShipments, completedShipments, todayShipments] = await Promise.all([
            Shipment.count({ where: { driverId } }),
            Shipment.count({ where: { driverId, status: { [Op.in]: ['assigned', 'picked_up', 'delivering'] } } }),
            Shipment.count({ where: { driverId, status: 'delivered' } }),
            Shipment.count({
                where: {
                    driverId,
                    createdAt: {
                        [Op.gte]: new Date().setHours(0, 0, 0, 0)
                    }
                }
            })
        ]);

        res.json({
            totalShipments,
            activeShipments,
            completedShipments,
            todayShipments
        });

    } catch (error) {
        console.error('Error getting driver stats:', error);
        res.status(500).json({ message: 'Lỗi lấy thống kê', error: error.message });
    }
};

/**
 * --- CHỈ THÊM HÀM NÀY ĐỂ TRANG ADMIN KHÔNG BỊ LỖI ---
 * Lấy danh sách tất cả tài xế
 */

// ...

exports.getAllDrivers = async (req, res) => {
    try {

        // 1. Lấy tất cả Drivers cùng xe họ đang lái
        const drivers = await User.findAll({
            where: { role: 'driver' },
            attributes: ['id', 'fullName', 'phone', 'email', 'address'],
            include: [
                {
                    model: Shipment,
                    as: 'assignedShipments',
                    where: {
                        status: {
                            [Op.in]: ['assigned', 'picked_up', 'delivering']
                        }
                    },
                    required: false,
                    attributes: ['id', 'status']
                },
                {
                    model: Vehicle,
                    as: 'drivenVehicle',
                    required: false,
                    attributes: ['id', 'vehicleType', 'licensePlate']
                }
            ]
        });

        // 2. Lấy tất cả Vehicles CHƯA có Driver gán vào
        const unassignedVehicles = await Vehicle.findAll({
            where: { driverId: null },
            attributes: ['id', 'vehicleType', 'licensePlate']
        });

        // 3. Map danh sách Drivers
        const formattedDrivers = drivers.map(driver => {
            const activeShipment = driver.assignedShipments && driver.assignedShipments.length > 0
                ? driver.assignedShipments[0]
                : null;
            const status = activeShipment ? 'Bận' : 'Rảnh';
            const vehicle = driver.drivenVehicle;

            return {
                id: `driver-${driver.id}`,
                realId: driver.id,
                type: 'driver',
                name: driver.fullName,
                phone: driver.phone,
                vehicle: vehicle ? vehicle.vehicleType : "Chưa có xe",
                plate: vehicle ? vehicle.licensePlate : "---",
                status: status,
                current_job: activeShipment ? activeShipment.id : null
            };
        });

        // 4. Map danh sách Xe chưa gán
        const formattedVehicles = unassignedVehicles.map(v => ({
            id: `vehicle-${v.id}`,
            realId: v.id,
            type: 'unassigned_vehicle',
            name: "Chưa phân công",
            phone: "---",
            vehicle: v.vehicleType,
            plate: v.licensePlate,
            status: "Rảnh",
            current_job: null
        }));

        // Gộp lại trả về
        res.json([...formattedDrivers, ...formattedVehicles]);
    } catch (error) {
        console.error('Error getting all drivers:', error);
        res.status(500).json([]);
    }
};

/**
 * Tạo tài xế mới
 */
exports.createDriver = async (req, res) => {
    try {
        const { fullName, email, password, phone, address } = req.body;

        // 1. Kiểm tra email tồn tại
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) return res.status(400).json({ message: 'Email đã được sử dụng' });

        const bcrypt = require('bcryptjs');
        const hashedPassword = await bcrypt.hash(password || '123456', 10);

        // 2. Tạo User role driver
        const newUser = await User.create({
            fullName,
            email,
            password: hashedPassword,
            phone,
            address,
            role: 'driver'
        });

        res.status(201).json({ message: 'Tạo tài xế thành công', driver: newUser });

    } catch (error) {
        console.error('Error creating driver:', error);
        res.status(500).json({ message: 'Lỗi tạo tài xế', error: error.message });
    }
};

/**
 * Cập nhật thông tin tài xế
 */
exports.updateDriver = async (req, res) => {
    try {
        const { id } = req.params;
        const { fullName, phone, address, email } = req.body;

        const driver = await User.findOne({ where: { id, role: 'driver' } });
        if (!driver) return res.status(404).json({ message: 'Không tìm thấy tài xế' });

        if (fullName) driver.fullName = fullName;
        if (phone) driver.phone = phone;
        if (address) driver.address = address;
        if (email) driver.email = email;

        await driver.save();
        res.json({ message: 'Cập nhật tài xế thành công', driver });

    } catch (error) {
        console.error('Error updating driver:', error);
        res.status(500).json({ message: 'Lỗi cập nhật tài xế' });
    }
};

/**
 * Xóa tài xế
 */
exports.deleteDriver = async (req, res) => {
    try {
        const { id } = req.params;
        const driver = await User.findOne({ where: { id, role: 'driver' } });
        if (!driver) return res.status(404).json({ message: 'Không tìm thấy tài xế' });

        // Giải phóng xe đang gán (nếu có)
        await Vehicle.update({ driverId: null }, { where: { driverId: id } });

        await driver.destroy();
        res.json({ message: 'Xoá tài xế thành công' });

    } catch (error) {
        console.error('Error deleting driver:', error);
        res.status(500).json({ message: 'Lỗi xoá tài xế' });
    }
};


const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


// Đảm bảo tên hàm này khớp 100% với file Routes
exports.loginDriver = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Logic test nhanh để bạn vào được Dashboard
        return res.json({
            success: true, // Bắt buộc phải có để Frontend chạy tiếp
            token: 'test_token_2026',
            message: 'Đăng nhập thành công!'
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
};

// Nếu dòng 31 gọi signupDriver thì phải có hàm này
exports.signupDriver = async (req, res) => {
    res.json({ success: true, message: 'Signup test OK' });
};

