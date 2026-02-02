// src/models/PublicNotification.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const PublicNotification = sequelize.define('PublicNotification', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    type: {
        type: DataTypes.STRING,
        defaultValue: 'info', // info, warning, success, announcement, education
        validate: {
            isIn: [['info', 'warning', 'success', 'announcement', 'education']]
        }
    },
    category: {
        type: DataTypes.STRING,
        allowNull: true, // product_update, event, education, general
    },
    imageUrl: {
        type: DataTypes.STRING,
        allowNull: true
    },
    linkUrl: {
        type: DataTypes.STRING,
        allowNull: true
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    publishedAt: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    timestamps: true
});

module.exports = PublicNotification;
