// src/controllers/authController.js
const { User } = require('../models');

// @desc    Sync user from Firebase to SQL Server (Login/Register)
// @route   POST /api/auth/sync-user
// @access  Private (Valid Firebase Token required)
exports.syncUser = async (req, res) => {
  try {
    // req.userFirebase được populate từ middleware verifyToken
    const { uid, email, name, picture } = req.userFirebase;

    // Client có thể gửi thêm role nếu là đăng ký mới (Optional)
    const { role, fullName } = req.body;

    // 1. Tìm user trong DB theo firebaseUid
    let user = await User.findOne({ where: { firebaseUid: uid } });

    if (user) {
      // User đã tồn tại -> Trả về thông tin
      return res.status(200).json({
        message: 'Đăng nhập thành công!',
        user: user
      });
    }

    // 2. Nếu chưa có firebaseUid, check xem email đã tồn tại chưa (Trường hợp migrate từ hệ thống cũ)
    user = await User.findOne({ where: { email } });

    if (user) {
      // Cập nhật firebaseUid cho user cũ
      user.firebaseUid = uid;
      await user.save();
      return res.status(200).json({
        message: 'Đồng bộ tài khoản cũ thành công!',
        user: user
      });
    }

    // 3. Nếu chưa có gì cả -> Tạo User mới
    const newUser = await User.create({
      firebaseUid: uid,
      email: email,
      fullName: fullName || name || 'New User',
      role: role || 'retailer', // Default role
      status: 'active'
    });

    res.status(201).json({
      message: 'Đăng ký tài khoản mới thành công!',
      user: newUser
    });

  } catch (error) {
    console.error('Sync User Error:', error);
    res.status(500).json({ message: 'Lỗi đồng bộ User', error: error.message });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const { uid } = req.userFirebase;
    const user = await User.findOne({ where: { firebaseUid: uid } });

    if (!user) {
      return res.status(404).json({ message: 'User not found in SQL Database' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};