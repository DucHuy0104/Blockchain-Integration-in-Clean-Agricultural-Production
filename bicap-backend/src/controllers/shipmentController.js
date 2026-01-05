// src/controllers/shipmentController.js
const { Shipment, Order, Farm, User, Product } = require('../models');

// 1. Tạo đơn vận chuyển (Chỉ khi Order đã confirmed)
exports.createShipment = async (req, res) => {
    try {
        const { orderId, driverId, vehicleInfo, pickupTime } = req.body;
        const managerId = req.user.id; // Người tạo là Farm Owner hoặc Logistics Manager

        const order = await Order.findByPk(orderId, { include: ['product'] });
        if (!order) return res.status(404).json({ message: 'Đơn hàng không tồn tại' });
        if (order.status !== 'confirmed') return res.status(400).json({ message: 'Đơn hàng chưa được xác nhận' });

        // Kiểm tra quyền (chủ trại mới được tạo vận đơn cho hàng của mình)
        const farmId = order.product.farmId;
        const farm = await Farm.findByPk(farmId);
        if (farm.ownerId !== req.user.id) return res.status(403).json({ message: 'Không có quyền tạo vận đơn cho đơn hàng này' });

        const shipment = await Shipment.create({
            orderId,
            managerId,
            driverId: driverId || null,
            vehicleInfo,
            pickupTime,
            status: 'created'
        });

        // Cập nhật trạng thái đơn hàng sang shipping (nếu muốn logic tự động)
        // order.status = 'shipping';
        // await order.save();

        // --- NOTIFICATION START ---
        const { createNotificationInternal } = require('./notificationController');
        // order is loaded with include 'product', we need retailerId from order
        // Reload order to be safe or check if retailerId is simple field (it is)
        await createNotificationInternal(
            order.retailerId,
            'Vận đơn mới',
            `Đơn hàng #${order.id} đã có vận đơn mới #${shipment.id}. Dự kiến giao: ${pickupTime}`,
            'shipment'
        );
        // --- NOTIFICATION END ---

        res.status(201).json({ message: 'Tạo vận đơn thành công', shipment });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi tạo vận đơn', error: error.message });
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
                    include: [{
                        model: Product,
                        as: 'product',
                        where: { farmId } // Filter shipments where product belongs to farmId
                    }]
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
            // Cập nhật luôn Order -> completed
            const order = await Order.findByPk(shipment.orderId);
            if (order) {
                order.status = 'completed';
                await order.save();
            }
        } else if (status === 'delivering') {
            const order = await Order.findByPk(shipment.orderId);
            if (order) {
                order.status = 'shipping';
                await order.save();
            }
        }

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
