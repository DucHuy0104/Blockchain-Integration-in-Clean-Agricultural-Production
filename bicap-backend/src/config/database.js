const { Sequelize } = require('sequelize');
require('dotenv').config();

const dbName = process.env.DB_NAME;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbServer = process.env.DB_SERVER || 'localhost';
const dbPort = parseInt(process.env.DB_PORT) || 1433;

// Helper to create DB if not exists
const ensureDbExists = async () => {
  const tempSequelize = new Sequelize('master', dbUser, dbPassword, {
    host: dbServer,
    port: dbPort,
    dialect: 'mssql',
    logging: false,
    dialectOptions: {
      options: {
        encrypt: false,
        trustServerCertificate: true,
      },
    },
  });

  try {
    await tempSequelize.authenticate();
    console.log('✅ Connected to SQL Server (master). Checking database...');

    const [results] = await tempSequelize.query(`SELECT name FROM sys.databases WHERE name = '${dbName}'`);

    // MSSQL query results format: [ [ { name: 'BICAP' } ], ... ]
    if (results && results.length > 0) {
      console.log(`ℹ️ Database "${dbName}" already exists.`);
    } else {
      console.log(`⚠️ Database "${dbName}" does not exist. Creating...`);
      await tempSequelize.query(`CREATE DATABASE ${dbName}`);
      console.log(`✅ Database "${dbName}" created successfully.`);
    }
  } catch (error) {
    console.error('❌ Error checking/creating database:', error.message);
    // Continue anyway, maybe it exists but query failed?
  } finally {
    await tempSequelize.close();
  }
};

// Khởi tạo kết nối Sequelize chính
const sequelize = new Sequelize(
  dbName,
  dbUser,
  dbPassword,
  {
    host: dbServer,
    port: dbPort,
    dialect: 'mssql',
    logging: false,
    dialectOptions: {
      options: {
        encrypt: false,
        trustServerCertificate: true,
      },
    },
  }
);

const connectDB = async () => {
  await ensureDbExists(); // Ensure DB exists before strict connection
  try {
    await sequelize.authenticate();
    console.log(`✅ KẾT NỐI DATABASE THÀNH CÔNG! (${dbName} @ ${dbServer})`);
  } catch (error) {
    console.error('❌ KẾT NỐI DATABASE THẤT BẠI:', error);
    console.error('Chi tiết lỗi:', error.original || error);
  }
};

module.exports = { sequelize, connectDB };