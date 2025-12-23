// src/models/User.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  fullName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'retailer', 
    // Các role dự kiến: 'admin', 'farm', 'driver', 'retailer'
    validate: {
      isIn: [['admin', 'farm', 'driver', 'retailer']]
    }
  },
  walletAddress: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Địa chỉ ví Blockchain VeChain'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  timestamps: true, // Tự động tạo cột createdAt, updatedAt
});

module.exports = User;