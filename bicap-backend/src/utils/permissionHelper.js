const { Subscription, Product } = require('../models');
const { Op } = require('sequelize');

/**
 * Định nghĩa giới hạn cho từng gói dịch vụ
 * Keys must match subscriptionController.js PACKAGES keys
 */
const PACKAGE_LIMITS = {
    'basic': { // Gói Cơ Bản (Free)
        maxProducts: 5,
        maxSeasons: 2,
        hasAI: false,
        prioritySupport: false
    },
    'pro': { // Gói Chuyên Nghiệp
        maxProducts: 20,
        maxSeasons: 20,
        hasAI: true,
        prioritySupport: true
    },
    'enterprise': { // Gói Doanh Nghiệp
        maxProducts: Infinity,
        maxSeasons: Infinity,
        hasAI: true,
        prioritySupport: true
    }
};

/**
 * Kiểm tra giới hạn gói dịch vụ
 * @param {number} userId - ID người dùng
 * @param {string} feature - Tính năng cần kiểm tra ('create_product', 'create_season', 'ai_access')
 * @returns {Promise<boolean>} - True nếu được phép, False nếu vượt giới hạn
 */
async function checkLimit(userId, feature) {
    try {
        // 1. Lấy gói dịch vụ đang kích hoạt
        const subscription = await Subscription.findOne({
            where: {
                userId,
                status: 'active',
                endDate: { [Op.gt]: new Date() } // Còn hạn
            },
            order: [['createdAt', 'DESC']]
        });

        const packageType = subscription ? subscription.packageType.toLowerCase() : 'basic';
        const limits = PACKAGE_LIMITS[packageType] || PACKAGE_LIMITS['basic'];

        if (feature === 'ai_access') {
            return limits.hasAI;
        }

        if (feature === 'create_product') {
            const productCount = await Product.count({ where: { farmId: userId } }); // Giả sử farmId = userId (Farm Owner)
            return productCount < limits.maxProducts;
        }

        // Thêm các check khác nếu cần
        return true;

    } catch (error) {
        console.error('Error checking limits:', error);
        return false; // Default fail safe
    }
}

/**
 * Lấy thông tin giới hạn hiện tại của user
 */
async function getUserLimits(userId) {
    const subscription = await Subscription.findOne({
        where: {
            userId,
            status: 'active',
            endDate: { [Op.gt]: new Date() }
        },
        order: [['createdAt', 'DESC']]
    });

    const packageType = subscription ? subscription.packageType.toLowerCase() : 'basic';
    const limits = PACKAGE_LIMITS[packageType] || PACKAGE_LIMITS['basic'];

    // Lấy usage hiện tại
    const productCount = await Product.count({ where: { farmId: userId } });

    return {
        packageType,
        limits,
        usage: {
            products: productCount
        }
    };
}

module.exports = {
    checkLimit,
    getUserLimits,
    PACKAGE_LIMITS
};
