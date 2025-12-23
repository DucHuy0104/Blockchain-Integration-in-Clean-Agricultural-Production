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
    allowNull: false,
    comment: 'Tên sản phẩm (Vd: Dâu tây giống Nhật)'
  },
  batchCode: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    comment: 'Mã lô hàng (Vd: DT-2024-001)'
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'cultivating', 
    // cultivating: đang trồng, harvested: đã thu hoạch, processing: đang sơ chế, distributed: đã phân phối
    validate: {
      isIn: [['cultivating', 'harvested', 'processing', 'distributed']]
    }
  },
  farmId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  timestamps: true
});

module.exports = Product;