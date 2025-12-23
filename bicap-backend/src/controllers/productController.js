// src/controllers/productController.js
const { Product, Farm } = require('../models');

// 1. Tạo lô sản phẩm mới
exports.createProduct = async (req, res) => {
  try {
    const { name, batchCode, quantity, farmId } = req.body;

    // Kiểm tra xem Farm có tồn tại không
    const farm = await Farm.findByPk(farmId);
    if (!farm) {
      return res.status(404).json({ message: 'Trang trại không tồn tại' });
    }

    // Kiểm tra quyền: Chỉ chủ trại mới được thêm sản phẩm vào trại của mình
    if (farm.ownerId !== req.user.id) {
      return res.status(403).json({ message: 'Bạn không có quyền thêm sản phẩm vào trại này' });
    }

    const newProduct = await Product.create({
      name,
      batchCode,
      quantity,
      farmId
    });

    res.status(201).json({
      message: 'Tạo lô sản phẩm thành công!',
      product: newProduct
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// 2. Lấy danh sách sản phẩm theo Farm
exports.getProductsByFarm = async (req, res) => {
  try {
    const { farmId } = req.params;
    
    const products = await Product.findAll({
      where: { farmId }
    });

    res.status(200).json({ products });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server' });
  }
};