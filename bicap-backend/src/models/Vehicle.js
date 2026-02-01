const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Vehicle = sequelize.define('Vehicle', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    ownerId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'ID của Shipping Manager hoặc Farm Owner sở hữu xe'
    },
    driverId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'ID của tài xế đang sử dụng xe (nếu có)'
    },
    licensePlate: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    vehicleType: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'Truck, Van, Motorcycle, etc.'
    },
    capacity: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'e.g., 2000kg, 5m3'
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: 'available',
        validate: {
            isIn: [['available', 'busy', 'maintenance', 'out_of_service']]
        }
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    timestamps: true
});

module.exports = Vehicle;
