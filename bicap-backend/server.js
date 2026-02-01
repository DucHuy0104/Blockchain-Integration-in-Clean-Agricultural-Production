const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// SỬA DÒNG NÀY: Import từ models/index thay vì config/database
const { connectDB } = require('./src/config/database');
const { initModels } = require('./src/models');
const { connectRedis } = require('./src/config/redis');
const authRoutes = require('./src/routes/authRoutes');
const farmRoutes = require('./src/routes/farmRoutes');
const seasonRoutes = require('./src/routes/seasonRoutes');
const productRoutes = require('./src/routes/productRoutes');
const orderRoutes = require('./src/routes/orderRoutes');
const shipmentRoutes = require('./src/routes/shipmentRoutes');
const reportRoutes = require('./src/routes/reportRoutes');
const monitoringRoutes = require('./src/routes/monitoringRoutes');
const subscriptionRoutes = require('./src/routes/subscriptionRoutes');
const paymentRoutes = require('./src/routes/paymentRoutes');
const driverRoutes = require('./src/routes/driverRoutes');
const adminRoutes = require('./src/routes/adminRoutes');
const publicRoutes = require('./src/routes/publicRoutes');
require('./src/services/blockchainQueue'); // Start blockchain worker

const app = express();

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://127.0.0.1:3000'],
  credentials: true
}));
app.use(express.json());

// ===== RATE LIMITING =====
// General API rate limiter: 100 requests per 15 minutes
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Strict limiter for authentication endpoints: 5 requests per 15 minutes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many login attempts, please try again later.',
  skipSuccessfulRequests: true, // Don't count successful requests
});

// Apply rate limiters
app.use('/api/', apiLimiter); // Apply to all API routes
app.use('/api/auth/login', authLimiter); // Stricter limit for login
app.use('/api/auth/register', authLimiter); // Stricter limit for register

// Serve static files (uploads)
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Debug Middleware: Log all requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Hàm khởi tạo hệ thống
const startServer = async () => {
  try {
    // 1. Kết nối Database
    await connectDB();

    // 2. Kết nối Redis (optional - không block nếu fail)
    await connectRedis();

    // 3. Đồng bộ bảng (Tạo bảng Users nếu chưa có)
    await initModels();

    // 4. Chạy Server
    const PORT = process.env.PORT || 5001;
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
app.use('/api/orders', orderRoutes);
app.use('/api/shipments', shipmentRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/monitoring', monitoringRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/driver', driverRoutes); // Mobile App dùng cái này
app.use('/api/drivers', driverRoutes); // Web Dashboard dùng cái này (Lấy danh sách)
app.use('/api/admin', adminRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/notifications', require('./src/routes/notificationRoutes'));
app.use('/api/tasks', require('./src/routes/seasonTaskRoutes'));
app.use('/api/vehicles', require('./src/routes/vehicleRoutes'));