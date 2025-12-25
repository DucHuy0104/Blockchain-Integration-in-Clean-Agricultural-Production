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
        // created: mới tạo, assigned: đã gán xe, picked_up: đã lấy hàng, delivering: đang giao, delivered: đã giao, failed: thất bại
        validate: {
            isIn: [['created', 'assigned', 'picked_up', 'delivering', 'delivered', 'failed']]
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
    txHash: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    timestamps: true
});

module.exports = Shipment;
