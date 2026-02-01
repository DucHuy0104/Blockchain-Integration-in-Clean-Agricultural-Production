const { User, Farm, FarmingSeason, Product } = require('../src/models');
const { connectDB } = require('../src/config/database');
require('dotenv').config();

const seedProducts = async () => {
    try {
        await connectDB();
        console.log('🌱 Bắt đầu thêm sản phẩm nông sản...\n');

        // Tìm hoặc tạo user farm
        let farmUser = await User.findOne({ where: { email: 'farm@test.com' } });
        if (!farmUser) {
            farmUser = await User.create({
                email: 'farm@test.com',
                fullName: 'Nông trại Mẫu',
                role: 'farm',
                firebaseUid: 'mock-farm-seed-' + Date.now(),
                status: 'active'
            });
            console.log('✅ Đã tạo tài khoản Farm mới');
        }

        // Tìm hoặc tạo farm
        let farm = await Farm.findOne({ where: { ownerId: farmUser.id } });
        if (!farm) {
            farm = await Farm.create({
                name: 'Trang trại Nông sản Sạch Việt',
                address: 'Đà Lạt, Lâm Đồng',
                description: 'Chuyên cung cấp nông sản sạch, an toàn',
                certification: 'VietGAP, GlobalGAP',
                location_coords: '11.9404,108.4583',
                ownerId: farmUser.id,
                status: 'active'
            });
            console.log('✅ Đã tạo Farm mới');
        }

        // Tạo mùa vụ nếu chưa có
        let season = await FarmingSeason.findOne({ where: { farmId: farm.id } });
        if (!season) {
            season = await FarmingSeason.create({
                name: 'Mùa vụ 2024',
                farmId: farm.id,
                cropType: 'Rau củ quả',
                startDate: new Date('2024-01-01'),
                endDate: new Date('2024-12-31'),
                status: 'active',
                area: 5000,
                expectedYield: 10000
            });
            console.log('✅ Đã tạo Mùa vụ mới');
        }

        // Danh sách sản phẩm đa dạng
        const products = [
            {
                name: 'Gạo ST25',
                category: 'Lương thực',
                description: 'Gạo ST25 thơm ngon, đạt giải Gạo ngon nhất thế giới',
                price: 45000,
                quantity: 5000,
                unit: 'kg',
                origin: 'Sóc Trăng',
                certification: 'VietGAP',
                status: 'available'
            },
            {
                name: 'Cà phê Robusta',
                category: 'Đồ uống',
                description: 'Cà phê Robusta nguyên chất từ Tây Nguyên',
                price: 65000,
                quantity: 2000,
                unit: 'kg',
                origin: 'Đắk Lắk',
                certification: 'Organic',
                status: 'available'
            },
            {
                name: 'Thanh long ruột đỏ',
                category: 'Trái cây',
                description: 'Thanh long Bình Thuận ngọt tự nhiên',
                price: 25000,
                quantity: 3000,
                unit: 'kg',
                origin: 'Bình Thuận',
                certification: 'VietGAP',
                status: 'available'
            },
            {
                name: 'Sầu riêng Ri6',
                category: 'Trái cây',
                description: 'Sầu riêng Ri6 chuẩn xuất khẩu, múi dày, hạt lép',
                price: 120000,
                quantity: 800,
                unit: 'kg',
                origin: 'Tiền Giang',
                certification: 'GlobalGAP',
                status: 'available'
            },
            {
                name: 'Xoài Cát Hòa Lộc',
                category: 'Trái cây',
                description: 'Xoài Cát Hòa Lộc thơm ngon, ngọt đậm',
                price: 55000,
                quantity: 1500,
                unit: 'kg',
                origin: 'Tiền Giang',
                certification: 'VietGAP',
                status: 'available'
            },
            {
                name: 'Rau cải xanh hữu cơ',
                category: 'Rau củ',
                description: 'Rau cải xanh trồng theo phương pháp hữu cơ',
                price: 15000,
                quantity: 500,
                unit: 'kg',
                origin: 'Đà Lạt',
                certification: 'Organic',
                status: 'available'
            },
            {
                name: 'Cà chua bi',
                category: 'Rau củ',
                description: 'Cà chua bi ngọt, giàu vitamin C',
                price: 35000,
                quantity: 800,
                unit: 'kg',
                origin: 'Đà Lạt',
                certification: 'VietGAP',
                status: 'available'
            },
            {
                name: 'Bưởi da xanh',
                category: 'Trái cây',
                description: 'Bưởi da xanh Bến Tre ngọt thanh, múi mọng nước',
                price: 40000,
                quantity: 1200,
                unit: 'kg',
                origin: 'Bến Tre',
                certification: 'VietGAP',
                status: 'available'
            },
            {
                name: 'Chôm chôm',
                category: 'Trái cây',
                description: 'Chôm chôm tươi ngọt, múi dày',
                price: 30000,
                quantity: 900,
                unit: 'kg',
                origin: 'Bến Tre',
                certification: 'VietGAP',
                status: 'available'
            },
            {
                name: 'Măng cụt',
                category: 'Trái cây',
                description: 'Măng cụt tươi ngon, vị ngọt thanh',
                price: 85000,
                quantity: 600,
                unit: 'kg',
                origin: 'Cần Thơ',
                certification: 'GlobalGAP',
                status: 'available'
            },
            {
                name: 'Dưa hấu không hạt',
                category: 'Trái cây',
                description: 'Dưa hấu không hạt ngọt mát',
                price: 18000,
                quantity: 2500,
                unit: 'kg',
                origin: 'Long An',
                certification: 'VietGAP',
                status: 'available'
            },
            {
                name: 'Khoai lang Nhật',
                category: 'Rau củ',
                description: 'Khoai lang Nhật ngọt bùi, giàu dinh dưỡng',
                price: 22000,
                quantity: 1800,
                unit: 'kg',
                origin: 'Đà Lạt',
                certification: 'VietGAP',
                status: 'available'
            },
            {
                name: 'Ớt hiểm',
                category: 'Gia vị',
                description: 'Ớt hiểm cay nồng, hương thơm đặc trưng',
                price: 95000,
                quantity: 300,
                unit: 'kg',
                origin: 'Lâm Đồng',
                certification: 'VietGAP',
                status: 'available'
            },
            {
                name: 'Hành tím',
                category: 'Gia vị',
                description: 'Hành tím Lý Sơn thơm nồng',
                price: 75000,
                quantity: 500,
                unit: 'kg',
                origin: 'Quảng Ngãi',
                certification: 'VietGAP',
                status: 'available'
            },
            {
                name: 'Chanh dây',
                category: 'Trái cây',
                description: 'Chanh dây chua ngọt, giàu vitamin',
                price: 28000,
                quantity: 1000,
                unit: 'kg',
                origin: 'Đà Lạt',
                certification: 'Organic',
                status: 'available'
            }
        ];

        // Thêm sản phẩm vào database
        let count = 0;
        for (const productData of products) {
            const batchCode = `BATCH-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

            await Product.create({
                ...productData,
                farmId: farm.id,
                seasonId: season.id,
                batchCode: batchCode,
                harvestDate: new Date()
            });

            count++;
            console.log(`✅ [${count}/${products.length}] Đã thêm: ${productData.name}`);
        }

        console.log(`\n🎉 Hoàn tất! Đã thêm ${count} sản phẩm vào sàn nông sản.`);
        console.log(`📍 Farm: ${farm.name}`);
        console.log(`🌾 Mùa vụ: ${season.cropType}`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Lỗi khi seed sản phẩm:', error);
        process.exit(1);
    }
};

seedProducts();
