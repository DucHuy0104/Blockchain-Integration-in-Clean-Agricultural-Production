// src/models/index.js
const { sequelize } = require('../config/database');
const User = require('./User');
const Farm = require('./Farm');
const Product = require('./Product');
const FarmingSeason = require('./FarmingSeason');
const FarmingProcess = require('./FarmingProcess');
const Order = require('./Order');
const Shipment = require('./Shipment');
const Notification = require('./Notification');
const Report = require('./Report');

// --- Define Associations ---

// 1. User & Farm
User.hasMany(Farm, { foreignKey: 'ownerId', as: 'farms' });
Farm.belongsTo(User, { foreignKey: 'ownerId', as: 'owner' });

// 2. Farm & Season
Farm.hasMany(FarmingSeason, { foreignKey: 'farmId', as: 'seasons' });
FarmingSeason.belongsTo(Farm, { foreignKey: 'farmId', as: 'farm' });

// 3. Season & Process
FarmingSeason.hasMany(FarmingProcess, { foreignKey: 'seasonId', as: 'processes' });
FarmingProcess.belongsTo(FarmingSeason, { foreignKey: 'seasonId', as: 'season' });

// 4. Farm & Product (Product cũng có thể link với Season nếu cần chi tiết hơn)
Farm.hasMany(Product, { foreignKey: 'farmId', as: 'products' });
Product.belongsTo(Farm, { foreignKey: 'farmId', as: 'farm' });

// 5. Order Relationships
// Retailer orders Product
User.hasMany(Order, { foreignKey: 'retailerId', as: 'orders', onDelete: 'NO ACTION' }); // Avoid cycle with User -> Farm -> Product -> Order
Order.belongsTo(User, { foreignKey: 'retailerId', as: 'retailer' });

Product.hasMany(Order, { foreignKey: 'productId', as: 'orders' });
Order.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

// 6. Shipment Relationships
// Shipment belongs to an Order
Order.hasOne(Shipment, { foreignKey: 'orderId', as: 'shipment' });
Shipment.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });

// Shipment created by Manager
User.hasMany(Shipment, { foreignKey: 'managerId', as: 'managedShipments', onDelete: 'NO ACTION' }); // Avoid cycle
Shipment.belongsTo(User, { foreignKey: 'managerId', as: 'manager' });

// Shipment assigned to Driver
User.hasMany(Shipment, { foreignKey: 'driverId', as: 'assignedShipments', onDelete: 'NO ACTION' }); // Avoid cycle
Shipment.belongsTo(User, { foreignKey: 'driverId', as: 'driver' });

// 7. Notification & Report
User.hasMany(Notification, { foreignKey: 'userId', as: 'notifications' });
Notification.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(Report, { foreignKey: 'senderId', as: 'sentReports', onDelete: 'NO ACTION' }); // Safe check
Report.belongsTo(User, { foreignKey: 'senderId', as: 'sender' });

const initModels = async () => {
  try {
    // Sync database (tạo bảng nếu chưa có).
    await sequelize.sync();

    console.log('✅ Database Schema Updated Successfully!');
  } catch (error) {
    console.error('❌ Database Sync Error:', error);
  }
};

module.exports = {
  sequelize,
  initModels,
  User,
  Farm,
  Product,
  FarmingSeason,
  FarmingProcess,
  Order,
  Shipment,
  Notification,
  Report
};