// src/models/Shipment.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Shipment = sequelize.define('Shipment', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    orderId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    driverId: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    managerId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    vehicleInfo: {
        type: DataTypes.STRING,
        allowNull: true
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: 'created',
        // created: mới tạo, pending_pickup: chờ lấy hàng, shipping: đang vận chuyển (chung), assigned: đã gán xe, picked_up: đã lấy hàng, delivering: đang giao, delivered: đã giao, failed: thất bại
        validate: {
            isIn: [['created', 'pending_pickup', 'shipping', 'assigned', 'picked_up', 'delivering', 'delivered', 'failed']]
        }
    },
    pickupTime: {
        type: DataTypes.DATE,
        allowNull: true
    },
    deliveryTime: {
        type: DataTypes.DATE,
        allowNull: true
    },
    currentLocation: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'GPS location hiện tại (lat,lng)'
    },
    pickupLocation: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'Địa điểm nhận hàng (lat,lng)'
    },
    deliveryLocation: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'Địa điểm giao hàng (lat,lng)'
    },
    pickupQRCode: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'QR code đã quét khi nhận hàng'
    },
    deliveryQRCode: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'QR code đã quét khi giao hàng'
    },
    txHash: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    timestamps: true
});

module.exports = Shipment;
