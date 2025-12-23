// src/models/index.js
const { sequelize } = require('../config/database');
const User = require('./User');
const Farm = require('./Farm');
const Product = require('./Product');

// Tại đây chúng ta sẽ định nghĩa quan hệ (Associations) sau này
// Ví dụ: User.hasMany(FarmProfile)...

// 1. Thêm quan hệ User - Farm
User.hasMany(Farm, { foreignKey: 'ownerId', as: 'farms' });
Farm.belongsTo(User, { foreignKey: 'ownerId', as: 'owner' });

// 2. Thêm quan hệ Farm - Product
Farm.hasMany(Product, { foreignKey: 'farmId', as: 'products' });
Product.belongsTo(Farm, { foreignKey: 'farmId', as: 'farm' });

const initModels = async () => {
  try {
    // Nghĩa là: "Nếu chưa có bảng thì tạo, có rồi thì THÔI, đừng sửa gì cả"
    await sequelize.sync({ force: false, alter: false }); 
    
    console.log('✅ Database đã sẵn sàng!');
  } catch (error) {
    console.error('❌ Lỗi:', error);
  }
};

module.exports = { 
  sequelize, 
  initModels, 
  User,
  Farm,
  Product
};