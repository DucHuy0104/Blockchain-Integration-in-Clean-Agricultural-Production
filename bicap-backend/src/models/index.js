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
const Subscription = require('./Subscription');

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

// 4. Farm & Product
Farm.hasMany(Product, { foreignKey: 'farmId', as: 'products' });
Product.belongsTo(Farm, { foreignKey: 'farmId', as: 'farm' });

Product.belongsTo(FarmingSeason, { foreignKey: 'seasonId', as: 'season' });
FarmingSeason.hasMany(Product, { foreignKey: 'seasonId', as: 'products' });

// 5. Order Relationships
User.hasMany(Order, { foreignKey: 'retailerId', as: 'orders', onDelete: 'NO ACTION' });
Order.belongsTo(User, { foreignKey: 'retailerId', as: 'retailer' });

Product.hasMany(Order, { foreignKey: 'productId', as: 'orders' });
Order.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

// 6. Shipment Relationships
Order.hasOne(Shipment, { foreignKey: 'orderId', as: 'shipment' });
Shipment.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });

User.hasMany(Shipment, { foreignKey: 'managerId', as: 'managedShipments', onDelete: 'NO ACTION' });
Shipment.belongsTo(User, { foreignKey: 'managerId', as: 'manager' });

User.hasMany(Shipment, { foreignKey: 'driverId', as: 'assignedShipments', onDelete: 'NO ACTION' });
Shipment.belongsTo(User, { foreignKey: 'driverId', as: 'driver' });

// 7. Notification & Report
User.hasMany(Notification, { foreignKey: 'userId', as: 'notifications' });
Notification.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(Report, { foreignKey: 'senderId', as: 'sentReports', onDelete: 'NO ACTION' });
Report.belongsTo(User, { foreignKey: 'senderId', as: 'sender' });

// 8. User & Subscription
User.hasMany(Subscription, { foreignKey: 'userId', as: 'subscriptions' });
Subscription.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// 9. Task Associations
// NONE

const initModels = async () => {
  try {
    // 1. Sync all tables (Create if not exists, but DO NOT ALTER)
    await sequelize.sync();

    // 2. Manual Migration for 'Products' table to add missing columns safely
    const queryInterface = sequelize.getQueryInterface();
    const tableDesc = await queryInterface.describeTable('Products');

    // Add 'price' if not exists
    if (!tableDesc.price) {
      console.log('⚡ Adding missing column: price to Products');
      await queryInterface.addColumn('Products', 'price', {
        type: require('sequelize').DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 0
      });
    }

    // Add 'seasonId' if not exists
    if (!tableDesc.seasonId) {
      console.log('⚡ Adding missing column: seasonId to Products');
      await queryInterface.addColumn('Products', 'seasonId', {
        type: require('sequelize').DataTypes.INTEGER,
        allowNull: true
        // Optimization: Skip adding FK constraint mostly to avoid MSSQL errors during dev
        // references: { model: 'FarmingSeasons', key: 'id' } 
      });
    }

    // 3. Manual Migration for 'Users' table
    const userTableDesc = await queryInterface.describeTable('Users');
    if (!userTableDesc.phone) {
      console.log('⚡ Adding missing column: phone to Users');
      await queryInterface.addColumn('Users', 'phone', {
        type: require('sequelize').DataTypes.STRING,
        allowNull: true
      });
    }

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
  Report,
  Subscription
};