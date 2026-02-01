const { User } = require('../src/models');
const { connectDB } = require('../src/config/database');

const testShippingAccess = async () => {
    try {
        await connectDB();

        console.log("🔍 Kiểm tra Users...");
        const users = await User.findAll({
            where: { email: ['shipping@test.com', 'shipping1@test.com', 'driver_hung@test.com'] }
        });

        for (const u of users) {
            console.log(`\n--- Testing User: ${u.email} (Role: ${u.role}) ---`);

            // Mock Token
            const mockPayload = JSON.stringify({
                id: u.id,
                email: u.email,
                role: u.role
            });
            const token = Buffer.from(mockPayload).toString('base64');

            try {
                const res = await fetch('http://localhost:5001/api/shipments/orders-ready', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (res.ok) {
                    const data = await res.json();
                    console.log(`✅ Request SUCCESS. Status: ${res.status}`);
                    console.log(`📦 Orders Ready: ${Array.isArray(data) ? data.length : 'OK'}`);
                } else {
                    const err = await res.json();
                    console.log(`❌ Request FAILED. Status: ${res.status} - ${err.message}`);
                }

            } catch (err) {
                console.error("❌ Request Error:", err.message);
            }
        }

    } catch (error) {
        console.error("Script Error:", error);
    }
};

testShippingAccess();
