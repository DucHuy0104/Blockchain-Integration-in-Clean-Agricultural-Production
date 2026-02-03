// src/models/RetailerProfile.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const RetailerProfile = sequelize.define('RetailerProfile', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    retailerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    businessName: {
        type: DataTypes.STRING,
        allowNull: true
    },
    businessLicenseNumber: {
        type: DataTypes.STRING,
        allowNull: true
    },
    businessLicenseImage: {
        type: DataTypes.STRING,
        allowNull: true
    },
    businessAddress: {
        type: DataTypes.STRING,
        allowNull: true
    },
    taxCode: {
        type: DataTypes.STRING,
        allowNull: true
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    timestamps: true
});

module.exports = RetailerProfile;
