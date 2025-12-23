// src/middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  let token;

  // 1. Kiểm tra xem header có gửi kèm Token không (Dạng: "Bearer <token>")
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // 2. Lấy token ra khỏi chuỗi "Bearer <token>"
      token = req.headers.authorization.split(' ')[1];

      // 3. Giải mã Token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 4. Gắn thông tin user vào request để các hàm sau dùng
      req.user = decoded; 

      next(); // Cho phép đi tiếp
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Token không hợp lệ hoặc đã hết hạn' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Không có quyền truy cập, vui lòng đăng nhập!' });
  }
};

module.exports = { protect };