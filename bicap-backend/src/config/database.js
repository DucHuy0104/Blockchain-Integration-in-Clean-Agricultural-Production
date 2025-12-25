const { Sequelize } = require('sequelize');
require('dotenv').config();

// Khởi tạo kết nối Sequelize
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mssql',       // Bắt buộc khai báo là mssql
    logging: false,         // Tắt log SQL để gọn terminal
    dialectOptions: {
      options: {
        encrypt: false,     // Tắt mã hóa khi chạy local/docker
        trustServerCertificate: true,
      },
    },
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ KẾT NỐI DATABASE THÀNH CÔNG! (SQL Server)');
  } catch (error) {
    console.error('❌ KẾT NỐI DATABASE THẤT BẠI:', error);
    // In chi tiết lỗi để dễ debug nếu sai password
    console.error('Chi tiết lỗi:', error.original || error);
  }
};

module.exports = { sequelize, connectDB };