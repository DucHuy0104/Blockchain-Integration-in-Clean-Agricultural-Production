// src/controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

// 1. Đăng ký tài khoản mới
exports.register = async (req, res) => {
  try {
    const { fullName, email, password, role } = req.body;

    // Kiểm tra email đã tồn tại chưa
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email này đã được sử dụng!' });
    }

    // Mã hóa mật khẩu
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Tạo user mới
    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
      role: role || 'retailer' // Mặc định là retailer nếu không chọn
    });

    res.status(201).json({
      message: 'Đăng ký thành công!',
      user: {
        id: newUser.id,
        fullName: newUser.fullName,
        email: newUser.email,
        role: newUser.role
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// 2. Đăng nhập (Sẽ làm ở bước sau, tạm thời để hàm rỗng)
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Kiểm tra xem có gửi đủ email/pass không
    if (!email || !password) {
      return res.status(400).json({ message: 'Vui lòng nhập email và mật khẩu' });
    }

    // Tìm user trong database
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Email không tồn tại' });
    }

    // So sánh mật khẩu (User nhập vào vs Mật khẩu mã hóa trong DB)
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Sai mật khẩu' });
    }

    // Nếu đúng hết -> Tạo Token (Vé thông hành)
    const token = jwt.sign(
      { id: user.id, role: user.role }, // Gói thông tin vào token
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '30d' }
    );

    res.status(200).json({
      message: 'Đăng nhập thành công!',
      token: token, // <--- Đây là thứ quan trọng nhất
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};