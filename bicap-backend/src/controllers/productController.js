// src/controllers/productController.js
const { Product, Farm, FarmingSeason } = require('../models');
const blockchainHelper = require('../utils/blockchainHelper');

// 1. Tạo lô sản phẩm mới (Đăng bán từ vụ mùa)
exports.createProduct = async (req, res) => {
  try {
    const { name, batchCode, quantity, price, farmId, seasonId } = req.body;

    // Kiểm tra xem Farm có tồn tại không
    const farm = await Farm.findByPk(farmId);
    if (!farm) {
      return res.status(404).json({ message: 'Trang trại không tồn tại' });
    }

    // Kiểm tra quyền: Chỉ chủ trại mới được thêm sản phẩm vào trại của mình
    if (farm.ownerId !== req.user.id) {
      return res.status(403).json({ message: 'Bạn không có quyền thêm sản phẩm vào trại này' });
    }

    // Validate Season if provided (Traceability)
    if (seasonId) {
      const season = await FarmingSeason.findOne({ where: { id: seasonId, farmId } });
      if (!season) {
        return res.status(400).json({ message: 'Vụ mùa không hợp lệ' });
      }
      if (season.status !== 'completed') {
        return res.status(400).json({ message: 'Vụ mùa chưa kết thúc, chưa thể đăng bán sản phẩm' });
      }
    }

    const newProductData = {
      name,
      batchCode,
      quantity,
      price: price || 0,
      farmId,
      seasonId, // Link to season
      status: 'available' // Ready to sell
    };

    // Ghi dữ liệu lên Blockchain (Mock)
    const txHash = await blockchainHelper.writeToBlockchain(newProductData);

    const newProduct = await Product.create({
      ...newProductData,
      txHash // Lưu hash vào DB
    });

    res.status(201).json({
      message: 'Đăng bán sản phẩm thành công!',
      product: newProduct
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// 2. Lấy danh sách sản phẩm theo Farm (Cho chủ trại quản lý)
exports.getProductsByFarm = async (req, res) => {
  try {
    const { farmId } = req.params;

    const products = await Product.findAll({
      where: { farmId },
      include: [{ model: FarmingSeason, as: 'season', attributes: ['name', 'startDate', 'endDate'] }],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({ products });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// 3. Lấy tất cả sản phẩm (Cho Marketplace)
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      where: { status: 'available' },
      include: [
        { model: Farm, as: 'farm', attributes: ['name', 'address', 'certification'] },
        { model: FarmingSeason, as: 'season', attributes: ['name'] }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi lấy danh sách sản phẩm' });
  }
};