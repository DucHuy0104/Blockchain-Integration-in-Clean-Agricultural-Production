const express = require('express');
const cors = require('cors');
require('dotenv').config();

// SỬA DÒNG NÀY: Import từ models/index thay vì config/database
const { connectDB } = require('./src/config/database');
const { initModels } = require('./src/models');
const authRoutes = require('./src/routes/authRoutes');
const farmRoutes = require('./src/routes/farmRoutes');
const seasonRoutes = require('./src/routes/seasonRoutes');
const productRoutes = require('./src/routes/productRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Hàm khởi tạo hệ thống
const startServer = async () => {
  try {
    // 1. Kết nối Database
    await connectDB();

    // 2. Đồng bộ bảng (Tạo bảng Users nếu chưa có)
    await initModels();

    // 3. Chạy Server
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server đang chạy tại: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Không thể khởi động server:', error);
  }
};

startServer();

// Routes

app.get('/', (req, res) => {
  res.send('🚀 BICAP Backend is Running!');
});

app.use('/api/auth', authRoutes);
app.use('/api/farms', farmRoutes);
app.use('/api/seasons', seasonRoutes);
app.use('/api/products', productRoutes);