// src/controllers/shipmentController.js
const { Shipment, Order, Farm, User, Product } = require('../models');

const blockchainHelper = require('../utils/blockchainHelper');

// API: GET /api/shipments?driverId=...
exports.getAllShipments = async (req, res) => {
    try {
        console.log("Đang gọi API lấy danh sách vận đơn...");

        // Lấy driverId từ URL (nếu có)
        const { driverId } = req.query;

        // Tạo điều kiện lọc
        let whereCondition = {};
        if (driverId) {
            whereCondition.driverId = driverId; // Chỉ lấy đơn của tài xế này
            console.log(`🔎 Đang lọc đơn hàng cho Tài xế ID: ${driverId}`);
        }

        const shipments = await Shipment.findAll({
            where: whereCondition, // <--- ✅ ÁP DỤNG ĐIỀU KIỆN LỌC VÀO ĐÂY
            include: [
                {
                    model: User,
                    as: 'driver',
                    attributes: ['id', 'fullName', 'phone']
                },
                {
                    model: Order,
                    as: 'order',
                    attributes: ['id', 'status'],
                    include: [
                        { model: Product, as: 'product', attributes: ['name', 'price'] }
                    ]
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        // Format dữ liệu cho Frontend dễ hiển thị
        const data = shipments.map(s => ({
            id: s.id,
            diemDi: s.pickupLocation || "Kho Trung Tâm",
            diemDen: s.deliveryLocation || "Khách hàng",
            taiXe: s.driver ? s.driver.fullName : "Chưa phân công",
            status: s.status, // Giữ nguyên trạng thái từ DB (assigned, picked_up...)
            details: {
                // Tạo mã QR từ ID thật
                qrCode: s.pickupQRCode || `SHIPMENT_${s.id}`,
                vehicle: s.driver?.vehicleType || "Xe tải",
                type: s.order?.product?.name || "Hàng hóa",
                weight: "---", // Nếu DB có cột weight thì thay vào đây
                time: s.updatedAt
            }
        }));

        res.status(200).json(data);

    } catch (error) {
        console.error("Lỗi Controller getAllShipments:", error);
        res.status(500).json({ message: "Lỗi Server khi lấy vận đơn", error: error.message });
    }
};

// 1. Tạo đơn vận chuyển (Chỉ khi Order đã confirmed)
exports.createShipment = async (req, res) => {
    try {
        const { orderId, driverId, vehicleInfo, pickupTime, estimatedDeliveryTime } = req.body;
        const managerId = req.user.id; // Farm Owner creates the request

        // 1. Verify Order
        const order = await Order.findOne({
            where: { id: orderId },
            include: [
                {
                    model: Product,
                    as: 'product',
                    include: [{ model: Farm, as: 'farm' }]
                },
                {
                    model: User,
                    as: 'retailer',
                    attributes: ['id', 'fullName', 'address', 'phone']
                }
            ]
        });

        if (!order) return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });

        // 2. Authorization: 
        // Allow if user is:
        // - Role 'shipping' (Shipping Manager)
        // - Role 'admin'
        // - The Farm Owner of the product
        const userRole = req.user.role;
        const isFarmOwner = order.product && order.product.farm && order.product.farm.ownerId === managerId;

        console.log(`[DEBUG_SHIPMENT] CreateShipment Check: UserRole='${userRole}', ManagerId=${managerId}, FarmOwnerId=${order.product?.farm?.ownerId}, IsFarmOwner=${isFarmOwner}`);

        if (userRole !== 'shipping' && userRole !== 'admin' && !isFarmOwner) {
            console.log('[DEBUG_SHIPMENT] 403 Blocked.');
            return res.status(403).json({ message: 'Bạn không có quyền tạo vận đơn cho đơn hàng này' });
        }

        if (order.status !== 'confirmed') {
            console.log(`[DEBUG_SHIPMENT] Order status invalid: ${order.status}`);
            return res.status(400).json({ message: `Đơn hàng phải ở trạng thái 'confirmed' (Hiện tại: ${order.status})` });
        }

        // 3. Check for existing shipment
        const existingShipment = await Shipment.findOne({
            where: {
                orderId,
                status: {
                    [require('sequelize').Op.notIn]: ['cancelled', 'failed']
                }
            }
        });

        if (existingShipment) {
            console.log(`[DEBUG_SHIPMENT] Active Shipment already exists: ${existingShipment.id}`);
            return res.status(400).json({ message: `Đơn hàng này đang có vận đơn hoạt động (Mã: ${existingShipment.id})` });
        }

        // 4. Determine Status
        // Không dùng 'shipping' vì không có trong validate của Shipment model
        let initialStatus = 'pending_pickup';
        if (driverId && vehicleInfo) {
            // Nếu có driver ngay, chuyển sang 'assigned' (nhưng thực tế nên để Shipping Manager gán)
            initialStatus = 'assigned';
        }

        // 5. Create Shipment
        const newShipment = await Shipment.create({
            trackingNumber: `SHIP-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            orderId,
            managerId,
            driverId: driverId || null,
            vehicleInfo: vehicleInfo || null,
            status: initialStatus,
            pickupTime: pickupTime || null,
            estimatedDeliveryTime: estimatedDeliveryTime || null,
            notes: driverId ? 'Farm Owner created shipment with driver' : 'Farm Owner requested shipping',
            // Auto-populate addresses
            pickupLocation: order.product.farm.address || 'Kho Trang Trại (Chưa cập nhật)',
            deliveryLocation: order.retailer.address || 'Địa chỉ Khách hàng (Chưa cập nhật)'
        });

        // 6. Update Order Status
        // Do NOT update to 'shipping' here yet. Wait for Manager to assign driver.
        // order.status = 'shipping';
        // await order.save();

        // 7. Blockchain Log (Mock)
        const txHash = await blockchainHelper.writeToBlockchain(`SHIPMENT-${newShipment.id}`, {
            type: 'CREATE_SHIPMENT',
            shipmentId: newShipment.id,
            orderId,
            managerId,
            timestamp: new Date().toISOString()
        });

        // 8. Notification (Mock)
        // Notify retailer
        const { createNotificationInternal } = require('./notificationController');
        await createNotificationInternal(
            order.retailerId,
            'Yêu cầu vận chuyển mới',
            `Đơn hàng #${order.id} đã được yêu cầu vận chuyển.`,
            'shipment'
        );

        res.status(201).json({
            message: driverId ? 'Tạo vận đơn thành công' : 'Đã gửi yêu cầu vận chuyển thành công',
            shipment: newShipment,
            txHash
        });

    } catch (error) {
        console.error('Create Shipment Error:', error);
        res.status(500).json({ message: 'Lỗi server khi tạo vận đơn', error: error.message });
    }
};

// 2. Lấy danh sách vận đơn của Farm (Để chủ trại theo dõi)
exports.getShipmentsByFarm = async (req, res) => {
    try {
        const { farmId } = req.params;

        // Verify ownership (optional strict check)
        // const farm = ...

        const shipments = await Shipment.findAll({
            include: [
                {
                    model: Order,
                    as: 'order',
                    required: true,
                    include: [
                        {
                            model: Product,
                            as: 'product',
                            where: { farmId } // Filter shipments where product belongs to farmId
                        },
                        {
                            model: User,
                            as: 'retailer',
                            attributes: ['fullName', 'phone', 'address']
                        }
                    ]
                },
                { model: User, as: 'driver', attributes: ['fullName', 'phone'] },
                { model: User, as: 'manager', attributes: ['fullName'] }
            ],
            order: [['createdAt', 'DESC']]
        });

        res.json({ shipments });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi lấy danh sách vận chuyển' });
    }
};

// 3. Cập nhật trạng thái vận đơn (Dành cho Driver hoặc Manager)
exports.updateShipmentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, deliveryTime } = req.body; // picked_up, delivering, delivered, failed

        const shipment = await Shipment.findByPk(id, { include: ['order'] });
        if (!shipment) return res.status(404).json({ message: 'Vận đơn không tồn tại' });

        // Logic check quyền (Driver được gán mới đc update, hoặc chủ trại)
        // ... skipped for simplicity ...

        shipment.status = status;
        if (status === 'delivered') {
            shipment.deliveryTime = deliveryTime || new Date();
            // Update Order -> delivered
            if (shipment.order) {
                shipment.order.status = 'delivered';
                await shipment.order.save();
            }
        } else if (status === 'delivering') {
            if (shipment.order) {
                shipment.order.status = 'shipping';
                await shipment.order.save();
            }
        }

        // ... (existing code)

        await shipment.save();

        // --- NOTIFICATION START ---
        const { createNotificationInternal } = require('./notificationController');
        const orderForNotify = await Order.findByPk(shipment.orderId);
        if (orderForNotify) {
            await createNotificationInternal(
                orderForNotify.retailerId,
                'Cập nhật vận chuyển',
                `Vận đơn #${shipment.id} đang ở trạng thái: ${status}`,
                'shipment'
            );
        }
        // --- NOTIFICATION END ---

        res.json({ message: 'Cập nhật trạng thái thành công', shipment });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi cập nhật vận đơn' });
    }
};

// 4. Lấy danh sách đơn hàng CẦN VẬN CHUYỂN (Chưa có Shipment)
exports.getOrdersForShipping = async (req, res) => {
    try {
        const orders = await Order.findAll({
            where: {
                status: 'confirmed'
                // TODO: Filter out orders that already have a shipment?
                // Sequelize "hasOne" might not easily filter "does not have".
                // Logic: Fetch confirmed, then filter in code or use sophisticated query.
            },
            include: [
                { model: Shipment, as: 'shipment' }, // To check if exists
                { model: Product, as: 'product', include: ['farm'] },
                { model: User, as: 'retailer', attributes: ['fullName', 'phone', 'address'] }
            ],
            order: [['createdAt', 'DESC']]
        });

        // Filter: Keep orders with NO shipment, OR shipment is 'failed', 'cancelled', 'created', 'pending_pickup'
        const ordersReady = orders.filter(o =>
            !o.shipment ||
            ['failed', 'cancelled', 'created', 'pending_pickup'].includes(o.shipment.status)
        );

        res.json(ordersReady);
    } catch (error) {
        console.error('Error fetching orders for shipping:', error);
        res.status(500).json({ message: 'Lỗi lấy danh sách đơn hàng chờ vận chuyển' });
    }
};

// 5. Hủy chuyến vận chuyển
exports.cancelShipment = async (req, res) => {
    try {
        const { id } = req.params;
        const { reason } = req.body;
        const managerId = req.user.id; // Or admin

        const shipment = await Shipment.findByPk(id);
        if (!shipment) return res.status(404).json({ message: 'Vận đơn không tồn tại' });

        // Check permission (Skipped for brevity, assume Manager/Admin)

        if (['picked_up', 'delivering', 'delivered'].includes(shipment.status)) {
            return res.status(400).json({ message: 'Không thể hủy đơn đang giao hoặc đã giao' });
        }

        shipment.status = 'cancelled';
        shipment.cancelReason = reason || 'Quản lý hủy';
        await shipment.save();

        // Revert Order status if needed
        const order = await Order.findByPk(shipment.orderId);
        if (order) {
            order.status = 'confirmed'; // Back to confirmed so it can be assigned again
            await order.save();
        }

        // Notify Driver
        if (shipment.driverId) {
            const { createNotificationInternal } = require('./notificationController');
            await createNotificationInternal(
                shipment.driverId,
                'Hủy chuyến',
                `Chuyến vận chuyển #${shipment.id} đã bị hủy. Lý do: ${shipment.cancelReason}`,
                'shipment'
            );
        }

        res.json({ message: 'Đã hủy chuyến vận chuyển thành công', shipment });

    } catch (error) {
        console.error('Error cancelling shipment:', error);
        res.status(500).json({ message: 'Lỗi hủy vận đơn' });
    }
};

// 6. Gán tài xế cho vận đơn có sẵn
exports.assignDriver = async (req, res) => {
    try {
        const { id } = req.params;
        const { driverId, vehicleInfo } = req.body;

        const shipment = await Shipment.findByPk(id);
        if (!shipment) return res.status(404).json({ message: 'Vận đơn không tồn tại' });

        // 1. Check Permission (Admin hoặc Shipping Manager)
        const userRole = req.user.role;
        if (userRole !== 'shipping' && userRole !== 'admin') {
            return res.status(403).json({ message: 'Bạn không có quyền gán tài xế' });
        }

        // 2. Validate Driver
        let cleanDriverId = driverId;
        if (typeof driverId === 'string' && driverId.startsWith('driver-')) {
            cleanDriverId = parseInt(driverId.replace('driver-', ''), 10);
        }

        const driver = await User.findOne({ where: { id: cleanDriverId, role: 'driver' } });
        if (!driver) return res.status(404).json({ message: 'Không tìm thấy tài xế này' });

        // 3. Update Shipment
        shipment.driverId = cleanDriverId;
        shipment.vehicleInfo = vehicleInfo || shipment.vehicleInfo;
        shipment.status = 'assigned'; // Chuyển sang trạng thái đã gán
        await shipment.save();

        // KHÔNG cập nhật Order status ngay khi gán driver
        // Order chỉ chuyển sang 'shipping' khi Driver thực sự nhận hàng (picked_up)

        // 4. Notify Driver
        const { createNotificationInternal } = require('./notificationController');
        await createNotificationInternal(
            cleanDriverId,
            'Chuyến hàng mới',
            `Bạn đã được gán cho vận đơn #${shipment.id}. Vui lòng đến địa chỉ lấy hàng và quét QR code để xác nhận.`,
            'shipment'
        );

        // 5. Notify Retailer
        const Order = require('../models/Order');
        const order = await Order.findByPk(shipment.orderId);
        if (order) {
            await createNotificationInternal(
                order.retailerId,
                'Đã phân công tài xế',
                `Vận đơn cho đơn hàng #${order.id} đã được phân công tài xế. Tài xế sẽ đến lấy hàng sớm.`,
                'shipment'
            );
        }

        res.json({
            message: 'Gán tài xế thành công',
            shipment: {
                ...shipment.toJSON(),
                driver: {
                    id: driver.id,
                    fullName: driver.fullName
                }
            }
        });

    } catch (error) {
        console.error('Error assigning driver:', error);
        res.status(500).json({ message: 'Lỗi gán tài xế', error: error.message });
    }
};
