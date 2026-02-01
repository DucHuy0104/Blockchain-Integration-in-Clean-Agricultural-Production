const { User, Farm, Product, Order, Shipment, Vehicle, sequelize } = require('../src/models');
require('dotenv').config();

const seedLogistics = async () => {
    try {
        console.log("🚀 Starting Logistics Seeding...");

        // --- 1. Create Drivers (Vietnamese Names) ---
        const driversData = [
            { email: 'driver_hung@test.com', name: 'Nguyễn Văn Hùng', phone: '0901234567' },
            { email: 'driver_tuan@test.com', name: 'Trần Minh Tuấn', phone: '0918765432' },
            { email: 'driver_long@test.com', name: 'Lê Hoàng Long', phone: '0988888888' },
            { email: 'driver_nam@test.com', name: 'Phạm Thành Nam', phone: '0977777777' },
            { email: 'driver_dung@test.com', name: 'Vũ Tiến Dũng', phone: '0966666666' },
        ];

        const drivers = [];
        for (const d of driversData) {
            const [user] = await User.findOrCreate({
                where: { email: d.email },
                defaults: {
                    fullName: d.name,
                    password: 'password123', // In real app, this should be hashed
                    role: 'driver',
                    status: 'active',
                    firebaseUid: `mock-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                    phone: d.phone
                }
            });
            drivers.push(user);
            console.log(`✅ Driver Created/Found: ${d.name} (${user.id})`);
        }

        // --- 2. Create Shipping Manager ---
        const [manager] = await User.findOrCreate({
            where: { email: 'shipping_manager@test.com' },
            defaults: {
                fullName: 'Công ty Vận Tải Toàn Cầu',
                role: 'shipping',
                status: 'active',
                firebaseUid: `mock-manager-${Date.now()}`
            }
        });
        console.log(`✅ Manager Created/Found: ${manager.fullName} (${manager.id})`);

        // --- 3. Create Vehicles (Real License Plates) ---
        const vehiclesData = [
            { plate: '29H-123.45', type: 'Truck', capacity: '5 Tấn', driverIdx: 0 },
            { plate: '51C-987.65', type: 'Van', capacity: '2 Tấn', driverIdx: 1 },
            { plate: '30F-555.88', type: 'Container', capacity: '20 Tấn', driverIdx: 2 },
            { plate: '60A-111.11', type: 'Truck', capacity: '8 Tấn', driverIdx: 3 },
            { plate: '92C-222.33', type: 'Van', capacity: '1.5 Tấn', driverIdx: 4 },
        ];

        for (const v of vehiclesData) {
            const [vehicle, created] = await Vehicle.findOrCreate({
                where: { licensePlate: v.plate },
                defaults: {
                    ownerId: manager.id, // Owned by Shipping Company
                    driverId: drivers[v.driverIdx].id, // Assigned to driver
                    vehicleType: v.type,
                    capacity: v.capacity,
                    status: 'available'
                }
            });
            if (created) console.log(`✅ Vehicle Created: ${v.plate} -> Driver: ${drivers[v.driverIdx].fullName}`);
            else console.log(`ℹ️ Vehicle Exists: ${v.plate}`);
        }

        // --- 4. Get Existing Products & Retailer for Orders ---
        const products = await Product.findAll();
        if (products.length === 0) {
            console.log("⚠️ No products found. Skipping Order creation.");
            return;
        }

        const [retailer] = await User.findOrCreate({
            where: { email: 'retailer_vip@test.com' },
            defaults: { fullName: 'Siêu Thị BigC', role: 'retailer', status: 'active', firebaseUid: `mock-retailer-${Date.now()}` }
        });

        // --- 5. Create Realistic Orders & Shipments ---
        // Statuses to seed: pending, confirmed, shipping, delivered
        const statuses = ['pending', 'confirmed', 'shipping', 'delivered', 'completed'];

        for (let i = 0; i < 10; i++) {
            const product = products[i % products.length];
            const status = statuses[i % statuses.length];

            // Create Order
            const order = await Order.create({
                retailerId: retailer.id,
                productId: product.id,
                quantity: Math.floor(Math.random() * 100) + 10,
                totalPrice: (Math.floor(Math.random() * 100) + 10) * (product.price || 50000),
                depositAmount: 100000,
                status: status,
                contractTerms: 'Điều khoản hợp đồng mẫu số 1...'
            });
            console.log(`📦 Order Created: #${order.id} [${status}]`);

            // If confirmed or later, create Shipment
            if (['confirmed', 'shipping', 'delivered', 'completed'].includes(status)) {
                let shipmentStatus = 'created';
                let assignedDriver = null;

                if (status === 'shipping') {
                    shipmentStatus = 'delivering';
                    assignedDriver = drivers[i % drivers.length];
                } else if (status === 'delivered' || status === 'completed') {
                    shipmentStatus = 'delivered';
                    assignedDriver = drivers[i % drivers.length];
                } else if (status === 'confirmed') {
                    shipmentStatus = 'assigned';
                    assignedDriver = drivers[i % drivers.length];
                }

                await Shipment.create({
                    orderId: order.id,
                    managerId: manager.id,
                    driverId: assignedDriver ? assignedDriver.id : null,
                    vehicleInfo: assignedDriver ? `Xe ${vehiclesData[i % vehiclesData.length].plate}` : null,
                    pickupLocation: 'Kho Hợp Tác Xã A',
                    deliveryLocation: 'Kho Siêu Thị BigC',
                    status: shipmentStatus,
                    pickupTime: status !== 'confirmed' ? new Date() : null,
                    deliveryTime: ['delivered', 'completed'].includes(status) ? new Date() : null
                });
                console.log(`   🚚 Shipment Created for Order #${order.id}: [${shipmentStatus}] ${assignedDriver ? '-> ' + assignedDriver.fullName : ''}`);
            }
        }

        console.log("🎉 Seeding Completed Successfully!");

    } catch (error) {
        console.error("❌ Seeding Failed:", error);
    }
};

const run = async () => {
    const { connectDB } = require('../src/config/database');
    await connectDB();
    await seedLogistics();
};

run();
