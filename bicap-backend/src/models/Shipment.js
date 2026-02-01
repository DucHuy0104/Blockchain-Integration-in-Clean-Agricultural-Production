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
        validate: {
            isIn: [['created', 'pending_pickup', 'assigned', 'picked_up', 'delivering', 'delivered', 'failed', 'cancelled']]
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
        allowNull: true
    },
    pickupLocation: {
        type: DataTypes.STRING,
        allowNull: true
    },
    deliveryLocation: {
        type: DataTypes.STRING,
        allowNull: true
    },
    pickupQRCode: {
        type: DataTypes.STRING,
        allowNull: true
    },
    deliveryQRCode: {
        type: DataTypes.STRING,
        allowNull: true
    },
    pickupImage: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    deliveryImage: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    cancelReason: {
        type: DataTypes.STRING,
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
