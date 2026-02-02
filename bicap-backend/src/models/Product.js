// src/models/Product.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  batchCode: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  category: {
    type: DataTypes.STRING,
    allowNull: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  price: {
    type: DataTypes.BIGINT,
    allowNull: false,
    defaultValue: 0
  },
  seasonId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'cultivating',
    // cultivating: đang trồng, harvested: đã thu hoạch, processing: đang sơ chế, distributed: đã phân phối, available: đang bán
    validate: {
      isIn: [['cultivating', 'harvested', 'processing', 'distributed', 'available', 'hidden', 'rejected']]
    }
  },
  farmId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true
  },
  txHash: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  timestamps: true,
  indexes: [
    { fields: ['farmId'] },           // Queries by farm
    { fields: ['seasonId'] },         // Queries by season
    { fields: ['status'] },           // Filter by status
    { fields: ['createdAt'] },        // Sort by date
    { fields: ['farmId', 'status'] }, // Combined queries
  ]
});

module.exports = Product;