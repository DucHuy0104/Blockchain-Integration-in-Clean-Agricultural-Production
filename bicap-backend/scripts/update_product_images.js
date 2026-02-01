const { Product } = require('../src/models');
const { connectDB } = require('../src/config/database');
require('dotenv').config();

const updateProductImages = async () => {
    try {
        await connectDB();
        console.log('🖼️  Bắt đầu cập nhật hình ảnh sản phẩm...\n');

        // Mapping ID sản phẩm với file ảnh
        const imageUpdates = [
            { id: 1, image: 'gao_st25_1769954414592.png', name: 'Gạo ST25' },
            { id: 2, image: 'gao_st25_1769954414592.png', name: 'gạo st25' },
            { id: 3, image: 'gao_st25_1769954414592.png', name: 'Gạo ST25' },
            { id: 4, image: 'ca_phe_robusta_1769954431541.png', name: 'Cà phê Robusta' },
            { id: 5, image: 'thanh_long_1769954446379.png', name: 'Thanh long ruột đỏ' },
            { id: 6, image: 'sau_rieng_ri6_1769954461438.png', name: 'Sầu riêng Ri6' },
            { id: 7, image: 'xoai_cat_hoa_loc_1769954481784.png', name: 'Xoài Cát Hòa Lộc' },
            { id: 8, image: 'rau_cai_xanh_1769954509656.png', name: 'Rau cải xanh hữu cơ' },
            { id: 9, image: 'ca_chua_bi_1769954525964.png', name: 'Cà chua bi' },
            { id: 10, image: 'buoi_da_xanh_1769954541656.png', name: 'Bưởi da xanh' }
        ];

        let count = 0;

        for (const { id, image, name } of imageUpdates) {
            const updated = await Product.update(
                { image: `/uploads/${image}` },
                { where: { id } }
            );

            console.log(`Debug: ID=${id}, Updated=${updated[0]}, Name=${name}`);

            if (updated[0] > 0) {
                count++;
                console.log(`✅ [${count}] Đã cập nhật ảnh cho: ${name}`);
            }
        }

        console.log(`\n🎉 Hoàn tất! Đã cập nhật ${count} hình ảnh sản phẩm.`);
        process.exit(0);
    } catch (error) {
        console.error('❌ Lỗi khi cập nhật hình ảnh:', error);
        process.exit(1);
    }
};

updateProductImages();
