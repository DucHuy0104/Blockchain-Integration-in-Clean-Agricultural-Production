// src/controllers/farmController.js
const { Farm } = require('../models');

// 1. Tạo trang trại mới
exports.createFarm = async (req, res) => {
  try {
    const { name, address, description, certification, location_coords } = req.body;

    // Lấy ID người dùng từ Token (do Middleware giải mã)
    // Đây là bước quan trọng để biết "Ai là chủ trang trại này"
    const ownerId = req.user.id;

    const newFarm = await Farm.create({
      name,
      address,
      description,
      certification,
      location_coords,
      ownerId
    });

    res.status(201).json({
      message: 'Tạo trang trại thành công!',
      farm: newFarm
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// 2. Lấy danh sách trang trại của tôi
exports.getMyFarms = async (req, res) => {
  try {
    const farms = await Farm.findAll({
      where: { ownerId: req.user.id } // Chỉ lấy trang trại của người đang đăng nhập
    });

    res.status(200).json({ farms });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server' });
  }
};