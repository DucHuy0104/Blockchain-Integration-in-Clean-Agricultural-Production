const { User, Order, Product, Farm } = require('../src/models');
const { connectDB } = require('../src/config/database');

const testPostShipment = async () => {
    try {
        await connectDB();

        // 1. Get Shipping User
        const shipper = await User.findOne({ where: { email: 'shipping@test.com' } });
        console.log(`Shipper: ${shipper.email} | Role: ${shipper.role} | ID: ${shipper.id}`);

        // 2. Mock Token
        const mockPayload = JSON.stringify({
            id: shipper.id,
            email: shipper.email,
            role: shipper.role
        });
        const token = Buffer.from(mockPayload).toString('base64');

        // 3. Find/Create a Confirmed Order
        let order = await Order.findOne({ where: { status: 'confirmed' } });
        if (!order) {
            console.log("Creating dummy confirmed order...");
            // Need product, farm, retailer
            const product = await Product.findOne();
            const retailer = await User.findOne({ where: { role: 'retailer' } });
            order = await Order.create({
                retailerId: retailer.id,
                productId: product.id,
                quantity: 10,
                totalPrice: 500000,
                status: 'confirmed'
            });
        }
        console.log(`Testing with Order ID: ${order.id}`);

        // 4. Send POST Request
        const payload = {
            orderId: order.id,
            vehicleInfo: "Test Truck",
            pickupTime: new Date().toISOString()
        };

        const res = await fetch('http://localhost:5001/api/shipments', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            console.log(`✅ POST /api/shipments: SUCCESS`);
        } else {
            console.log(`❌ POST /api/shipments: ${res.status}`);
            const err = await res.json();
            console.log(err);
        }

    } catch (error) {
        console.error("Error:", error);
    }
};

testPostShipment();
