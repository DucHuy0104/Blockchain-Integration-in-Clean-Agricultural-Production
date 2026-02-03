// src/utils/seeder.js
const {
    sequelize,
    User,
    Farm,
    Product,
    FarmingSeason,
    FarmingProcess,
    Order,
    Shipment,
    RetailerProfile,
    Vehicle
} = require('../models');

const seedData = async () => {
    try {
        console.log('🚀 Starting Seeding Process...');

        // 1. Clear existing data (Optional, but good for a fresh start)
        // await sequelize.sync({ force: true }); // WARNING: This drops all tables!
        // Safer way: truncate individual tables in order
        console.log('🧹 Cleaning old data...');
        await Shipment.destroy({ where: {}, truncate: false });
        await Order.destroy({ where: {}, truncate: false });
        await Product.destroy({ where: {}, truncate: false });
        await FarmingProcess.destroy({ where: {}, truncate: false });
        await FarmingSeason.destroy({ where: {}, truncate: false });
        await Farm.destroy({ where: {}, truncate: false });
        await RetailerProfile.destroy({ where: {}, truncate: false });
        await Vehicle.destroy({ where: {}, truncate: false });
        await User.destroy({ where: {}, truncate: false });

        console.log('👥 Seeding Users...');

        // --- USERS ---
        const users = await User.bulkCreate([
            // ADMINS
            {
                fullName: 'Hệ Thống Admin 1',
                email: 'admin1@bicap.vn',
                role: 'admin',
                firebaseUid: 'fb-uid-admin-1',
                status: 'active'
            },
            {
                fullName: 'Hệ Thống Admin 2',
                email: 'admin2@bicap.vn',
                role: 'admin',
                firebaseUid: 'fb-uid-admin-2',
                status: 'active'
            },
            // FARMS
            {
                fullName: 'Nguyễn Văn Nam - Farmer',
                email: 'nam.farm@gmail.com',
                role: 'farm',
                firebaseUid: 'fb-uid-farm-1',
                phone: '0912345678',
                address: 'Đà Lạt, Lâm Đồng',
                status: 'active'
            },
            {
                fullName: 'Trần Thị Thu - Farmer',
                email: 'thu.farm@gmail.com',
                role: 'farm',
                firebaseUid: 'fb-uid-farm-2',
                phone: '0987654321',
                address: 'Lục Ngạn, Bắc Giang',
                status: 'active'
            },
            {
                fullName: 'Lê Văn Miền - Farmer',
                email: 'mien.farm@gmail.com',
                role: 'farm',
                firebaseUid: 'fb-uid-farm-3',
                phone: '0933445566',
                address: 'Cần Thơ, Miền Tây',
                status: 'active'
            },
            // RETAILERS
            {
                fullName: 'Siêu Thị WinMart - Hà Nội',
                email: 'winmart.hn@retail.vn',
                role: 'retailer',
                firebaseUid: 'fb-uid-retail-1',
                status: 'active'
            },
            {
                fullName: 'Bách Hóa Xanh - TP.HCM',
                email: 'bhx.hcm@retail.vn',
                role: 'retailer',
                firebaseUid: 'fb-uid-retail-2',
                status: 'active'
            },
            {
                fullName: 'Cửa Hàng Thực Phẩm Sạch Lotte',
                email: 'lotte.clean@retail.vn',
                role: 'retailer',
                firebaseUid: 'fb-uid-retail-3',
                status: 'active'
            },
            // DRIVERS
            {
                fullName: 'Tài Xế Nguyễn Hùng',
                email: 'hung.driver@logistics.vn',
                role: 'driver',
                firebaseUid: 'fb-uid-driver-1',
                status: 'active'
            },
            {
                fullName: 'Tài Xế Trần Mạnh',
                email: 'manh.driver@logistics.vn',
                role: 'driver',
                firebaseUid: 'fb-uid-driver-2',
                status: 'active'
            },
            {
                fullName: 'Tài Xế Lê Quang',
                email: 'quang.driver@logistics.vn',
                role: 'driver',
                firebaseUid: 'fb-uid-driver-3',
                status: 'active'
            },
            // SHIPPING MANAGER
            {
                fullName: 'Điều Phối Viên Vận Tải',
                email: 'manager.shipping@logistics.vn',
                role: 'shipping_manager',
                firebaseUid: 'fb-uid-mgr-1',
                status: 'active'
            }
        ], { returning: true });

        const adminUser = users.find(u => u.email === 'admin1@bicap.vn');
        const farm1 = users.find(u => u.email === 'nam.farm@gmail.com');
        const farm2 = users.find(u => u.email === 'thu.farm@gmail.com');
        const farm3 = users.find(u => u.email === 'mien.farm@gmail.com');
        const retail1 = users.find(u => u.email === 'winmart.hn@retail.vn');
        const retail2 = users.find(u => u.email === 'bhx.hcm@retail.vn');
        const driver1 = users.find(u => u.email === 'hung.driver@logistics.vn');
        const driver2 = users.find(u => u.email === 'manh.driver@logistics.vn');
        const shipMgr = users.find(u => u.email === 'manager.shipping@logistics.vn');

        // --- RETAILER PROFILES ---
        console.log('🏢 Seeding Retailer Profiles...');
        await RetailerProfile.bulkCreate([
            {
                retailerId: retail1.id,
                businessName: 'Chuỗi Siêu Thị WinMart Miền Bắc',
                businessAddress: '123 Cầu Giấy, Hà Nội',
                taxCode: '0102030405',
                isVerified: true
            },
            {
                retailerId: retail2.id,
                businessName: 'Hệ Thống Bách Hóa Xanh TP.HCM',
                businessAddress: '456 Quận 1, TP.HCM',
                taxCode: '0607080910',
                isVerified: true
            }
        ]);

        // --- FARMS ---
        console.log('🌱 Seeding Farms...');
        const farms = await Farm.bulkCreate([
            {
                name: 'Nông Trại Xanh Highlands',
                address: 'Thôn 3, Xã Lát, Lạc Dương, Lâm Đồng',
                description: 'Chuyên canh rau sạch và dâu tây công nghệ cao.',
                certification: 'VietGAP',
                status: 'active',
                ownerId: farm1.id
            },
            {
                name: 'Vườn Vải Thiều Di Sản',
                address: 'Hồng Giang, Lục Ngạn, Bắc Giang',
                description: 'Trang trại vải thiều hữu cơ xuất khẩu EU.',
                certification: 'GlobalGAP',
                status: 'active',
                ownerId: farm2.id
            },
            {
                name: 'Cánh Đồng Vàng Miền Tây',
                address: 'Phong Điền, Cần Thơ',
                description: 'Sản xuất lúa gạo ST25 chuẩn GlobalGAP.',
                certification: 'VietGAP',
                status: 'active',
                ownerId: farm3.id
            }
        ], { returning: true });

        const farmData1 = farms[0];
        const farmData2 = farms[1];
        const farmData3 = farms[2];

        // --- SEASONS ---
        console.log('📅 Seeding Seasons...');
        const seasons = await FarmingSeason.bulkCreate([
            {
                name: 'Mùa Dâu Tây New Zealand 2024',
                startDate: new Date('2024-01-10'),
                endDate: new Date('2024-05-20'),
                status: 'active',
                farmId: farmData1.id
            },
            {
                name: 'Vụ Vải Thiều Chính Vụ 2024',
                startDate: new Date('2024-03-01'),
                endDate: new Date('2024-07-15'),
                status: 'active',
                farmId: farmData2.id
            },
            {
                name: 'Vụ Lúa Đông Xuân 2024',
                startDate: new Date('2023-11-15'),
                endDate: new Date('2024-03-10'),
                status: 'completed',
                farmId: farmData3.id
            }
        ], { returning: true });

        const season1 = seasons[0];
        const season2 = seasons[1];
        const season3 = seasons[2];

        // --- PROCESSES (Blockchain Logs Mock) ---
        console.log('📝 Seeding Farming Processes...');
        await FarmingProcess.bulkCreate([
            { type: 'Gieo hạt', description: 'Gieo hạt giống dâu tây nhập khẩu', seasonId: season1.id },
            { type: 'Bón phân', description: 'Bón phân hữu cơ sinh học đợt 1', seasonId: season1.id },
            { type: 'Phun thuốc', description: 'Phun chế phẩm sinh học ngăn ngừa nấm', seasonId: season1.id },
            { type: 'Ra hoa', description: 'Cây bắt đầu ra hoa đồng loạt', seasonId: season1.id },

            { type: 'Cắt tỉa', description: 'Cắt tỉa cành vải phát triển kém', seasonId: season2.id },
            { type: 'Tưới nước', description: 'Hệ thống tưới tự động IOT kích hoạt', seasonId: season2.id }
        ]);

        // --- PRODUCTS ---
        console.log('🥬 Seeding Products...');
        const products = await Product.bulkCreate([
            {
                name: 'Rau Cải Xanh Hữu Cơ',
                batchCode: 'RCX-001',
                category: 'Rau củ',
                description: 'Rau cải xanh tươi sạch, trồng theo tiêu chuẩn hữu cơ.',
                quantity: 500,
                price: 25000,
                status: 'available',
                image: '/uploads/rau_cai_xanh_1769954509656.png',
                farmId: farmData1.id,
                seasonId: season1.id
            },
            {
                name: 'Cà Chua Bi Đà Lạt',
                batchCode: 'CTB-002',
                category: 'Rau củ',
                description: 'Cà chua bi ngọt, chín mọng, size đều.',
                quantity: 1200,
                price: 45000,
                status: 'available',
                image: '/uploads/ca_chua_bi_1769954525964.png',
                farmId: farmData1.id,
                seasonId: season1.id
            },
            {
                name: 'Xoài Cát Hòa Lộc',
                batchCode: 'XCHL-003',
                category: 'Trái cây',
                description: 'Xoài cát Hòa Lộc thơm ngon, vị ngọt đậm đà.',
                quantity: 3000,
                price: 85000,
                status: 'available',
                image: '/uploads/xoai_cat_hoa_loc_1769954481784.png',
                farmId: farmData3.id,
                seasonId: season3.id
            },
            {
                name: 'Gạo ST25 Sạch',
                batchCode: 'G-ST25-004',
                category: 'Lương thực',
                description: 'Gạo ngon nhất thế giới, không dư lượng thuốc.',
                quantity: 5000,
                price: 35000,
                status: 'available',
                image: '/uploads/gao_st25_1769954414592.png',
                farmId: farmData3.id,
                seasonId: season3.id
            },
            {
                name: 'Sầu Riêng Ri6',
                batchCode: 'SR-R6-005',
                category: 'Trái cây',
                description: 'Sầu riêng Ri6 cơm vàng, hạt lép, mùi vị đặc trưng.',
                quantity: 800,
                price: 150000,
                status: 'available',
                image: '/uploads/sau_rieng_ri6_1769954461438.png',
                farmId: farmData1.id,
                seasonId: season1.id
            },
            {
                name: 'Bưởi Da Xanh',
                batchCode: 'BDX-006',
                category: 'Trái cây',
                description: 'Bưởi da xanh tép hồng, mọng nước, không hạt.',
                quantity: 2000,
                price: 60000,
                status: 'available',
                image: '/uploads/buoi_da_xanh_1769954541656.png',
                farmId: farmData3.id,
                seasonId: season3.id
            },
            {
                name: 'Cà Phê Robusta Đắk Lắk',
                batchCode: 'CP-RB-007',
                category: 'Lương thực',
                description: 'Cà phê Robusta nguyên chất, hương vị đậm đà vùng cao nguyên.',
                quantity: 10000,
                price: 75000,
                status: 'available',
                image: '/uploads/ca_phe_robusta_1769954431541.png',
                farmId: farmData1.id,
                seasonId: season1.id
            },
            {
                name: 'Chôm Chôm Nhãn Long Khánh',
                batchCode: 'CC-NK-008',
                category: 'Trái cây',
                description: 'Chôm chôm nhãn giòn ngọt, tróc hạt, đặc sản Đồng Nai.',
                quantity: 1500,
                price: 35000,
                status: 'available',
                image: '/uploads/chom_chom.png',
                farmId: farmData1.id,
                seasonId: season1.id
            },
            {
                name: 'Dưa Hấu Long An',
                batchCode: 'DH-LA-009',
                category: 'Trái cây',
                description: 'Dưa hấu Long An ngọt lịm, vỏ mỏng, ruột đỏ tươi.',
                quantity: 4000,
                price: 15000,
                status: 'available',
                image: '/uploads/dua_hau.png',
                farmId: farmData3.id,
                seasonId: season3.id
            },
            {
                name: 'Hành Tím Sóc Trăng',
                batchCode: 'HT-ST-010',
                category: 'Rau củ',
                description: 'Hành tím Vĩnh Châu thơm nồng, bảo quản được lâu.',
                quantity: 2500,
                price: 45000,
                status: 'available',
                image: '/uploads/hanh_tim.png',
                farmId: farmData3.id,
                seasonId: season3.id
            },
            {
                name: 'Khoai Lang Mật Đắk Lắk',
                batchCode: 'KL-DL-011',
                category: 'Củ quả',
                description: 'Khoai lang mật dẻo thơm, ngọt lịm khi nướng.',
                quantity: 3000,
                price: 30000,
                status: 'available',
                image: '/uploads/khoai_lang.png',
                farmId: farmData1.id,
                seasonId: season1.id
            },
            {
                name: 'Măng Cụt Lái Thiêu',
                batchCode: 'MC-LT-012',
                category: 'Trái cây',
                description: 'Măng cụt chín cây, vị chua ngọt thanh tao.',
                quantity: 1200,
                price: 95000,
                status: 'available',
                image: '/uploads/mang_cut.png',
                farmId: farmData1.id,
                seasonId: season1.id
            },
            {
                name: 'Ớt Hiểm Rừng Cay Nồng',
                batchCode: 'OH-RC-013',
                category: 'Rau củ',
                description: 'Ớt hiểm rừng tự nhiên, vị cay xé lưỡi, mùi thơm đặc trưng.',
                quantity: 500,
                price: 120000,
                status: 'available',
                image: '/uploads/ot_hiem.png',
                farmId: farmData1.id,
                seasonId: season1.id
            },
            {
                name: 'Thanh Long Ruột Đỏ Bình Thuận',
                batchCode: 'TL-BT-014',
                category: 'Trái cây',
                description: 'Thanh long ruột đỏ ngọt đậm, giàu dinh dưỡng.',
                quantity: 6000,
                price: 25000,
                status: 'available',
                image: '/uploads/thanh_long_1769954446379.png',
                farmId: farmData3.id,
                seasonId: season3.id
            },
            {
                name: 'Cam Sành Tiền Giang',
                batchCode: 'CS-TG-015',
                category: 'Trái cây',
                description: 'Cam sành mọng nước, vị chua ngọt hài hòa.',
                quantity: 3500,
                price: 28000,
                status: 'available',
                image: 'https://images.unsplash.com/photo-1557800636-894a64c1696f?q=80&w=400',
                farmId: farmData3.id,
                seasonId: season3.id
            },
            {
                name: 'Chuối Laba Đà Lạt',
                batchCode: 'C-LB-016',
                category: 'Trái cây',
                description: 'Chuối Laba dẻo thơm, đặc sản tiến vua.',
                quantity: 2000,
                price: 22000,
                status: 'available',
                image: 'https://images.unsplash.com/photo-1571771894821-ad9902012847?q=80&w=400',
                farmId: farmData1.id,
                seasonId: season1.id
            },
            {
                name: 'Bắp Nếp Hữu Cơ',
                batchCode: 'BN-HC-017',
                category: 'Củ quả',
                description: 'Bắp nếp dẻo, ngọt tự nhiên, không biến đổi gen.',
                quantity: 5000,
                price: 12000,
                status: 'available',
                image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?q=80&w=400',
                farmId: farmData1.id,
                seasonId: season1.id
            },
            {
                name: 'Súp Lơ Xanh Đà Lạt',
                batchCode: 'SL-XL-018',
                category: 'Rau củ',
                description: 'Súp lơ xanh tươi giòn, giàu chất xơ và vitamin.',
                quantity: 1000,
                price: 40000,
                status: 'available',
                image: 'https://images.unsplash.com/photo-1584270354949-c26b0d5b4a0c?q=80&w=400',
                farmId: farmData1.id,
                seasonId: season1.id
            },
            {
                name: 'Táo Gió Ninh Thuận',
                batchCode: 'TG-NT-019',
                category: 'Trái cây',
                description: 'Táo gió giòn ngọt, vỏ mỏng xanh mướt.',
                quantity: 3000,
                price: 35000,
                status: 'available',
                image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6bccb?q=80&w=400',
                farmId: farmData2.id,
                seasonId: season2.id
            },
            {
                name: 'Nho Xanh Ninh Thuận',
                batchCode: 'NX-NT-020',
                category: 'Trái cây',
                description: 'Nho xanh Ninh Thuận hạt nhỏ, vị ngọt thanh.',
                quantity: 1500,
                price: 85000,
                status: 'available',
                image: 'https://images.unsplash.com/photo-1537640538966-79f369b41f8f?q=80&w=400',
                farmId: farmData2.id,
                seasonId: season2.id
            },
            {
                name: 'Mít Thái Siêu Sớm',
                batchCode: 'MT-SS-021',
                category: 'Trái cây',
                description: 'Mít Thái múi dày, giòn ngọt, thơm nức.',
                quantity: 2500,
                price: 30000,
                status: 'available',
                image: 'https://images.unsplash.com/photo-1629830991666-07418f734783?q=80&w=400',
                farmId: farmData3.id,
                seasonId: season3.id
            }
        ], { returning: true });
        console.log(`🥬 Created ${products.length} products.`);

        const prod1 = products[0];
        const prod2 = products[1];

        // --- ORDERS ---
        console.log('🛒 Seeding Orders...');
        const orders = await Order.bulkCreate([
            {
                retailerId: retail1.id,
                productId: prod1.id,
                quantity: 50,
                totalPrice: 50 * 25000,
                depositAmount: 200000,
                status: 'shipping',
                contractTerms: 'Giao hàng đúng hẹn, đảm bảo độ tươi mới 95%.'
            },
            {
                retailerId: retail2.id,
                productId: prod2.id,
                quantity: 200,
                totalPrice: 200 * 45000,
                depositAmount: 1000000,
                status: 'confirmed',
                contractTerms: 'Đóng gói trong thùng carton lót giấy.'
            },
            {
                retailerId: retail1.id,
                productId: products.find(p => p.batchCode === 'G-ST25-004').id,
                quantity: 1000,
                totalPrice: 1000 * 35000,
                depositAmount: 5000000,
                status: 'completed',
                contractTerms: 'Giao tại kho bãi của WinMart.'
            }
        ], { returning: true });

        const order1 = orders[0];
        const order2 = orders[1];

        // --- SHIPMENTS ---
        console.log('🚚 Seeding Shipments...');
        await Shipment.bulkCreate([
            {
                orderId: order1.id,
                driverId: driver1.id,
                managerId: shipMgr.id,
                status: 'delivering',
                vehicleInfo: 'Xe Tải Isuzu 2.5 Tấn - 29C-123.45',
                pickupLocation: 'Đà Lạt, Lâm Đồng',
                deliveryLocation: 'Kho WinMart Hà Nội',
                currentLocation: 'Vĩnh Phúc (Đang di chuyển)'
            },
            {
                orderId: order2.id,
                driverId: driver2.id,
                managerId: shipMgr.id,
                status: 'assigned',
                vehicleInfo: 'Xe Tải Hino 5 Tấn - 51D-678.90',
                pickupLocation: 'Bắc Giang',
                deliveryLocation: 'Bách Hóa Xanh TP.HCM'
            }
        ]);

        // --- VEHICLES ---
        console.log('🚛 Seeding Vehicles...');
        await Vehicle.bulkCreate([
            {
                vehicleType: 'Xe Tải Đông Lạnh',
                licensePlate: '29C-123.45',
                capacity: '2.5 Tấn',
                status: 'active',
                ownerId: shipMgr.id,
                driverId: driver1.id
            },
            {
                vehicleType: 'Container',
                licensePlate: '51D-678.90',
                capacity: '10 Tấn',
                status: 'active',
                ownerId: shipMgr.id,
                driverId: driver2.id
            }
        ]);

        console.log('✅ Seeding Completed Successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding Error:', error);
        process.exit(1);
    }
};

seedData();
