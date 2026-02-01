const { Shipment, User } = require('../src/models');
const { connectDB } = require('../src/config/database');

const testAssignDriver = async () => {
    try {
        await connectDB();

        console.log("🔍 Đang tìm vận đơn chưa có tài xế...");
        const shipment = await Shipment.findOne({ where: { driverId: null } });

        if (!shipment) {
            console.log("ℹ️ Không tìm thấy vận đơn nào chưa gán tài xế. Vui lòng tạo một vận đơn mới từ trang Orders.");
            return;
        }

        console.log(`📦 Thử gán tài xế cho Vận đơn ID: ${shipment.id}`);

        // Tìm 1 tài xế
        const driver = await User.findOne({ where: { role: 'driver' } });
        if (!driver) {
            console.log("❌ Không tìm thấy tài xế nào trong DB.");
            return;
        }

        console.log(`🚚 Gán cho Tài xế: ${driver.fullName} (ID: ${driver.id})`);

        // Giả lập call API (Sử dụng hàm trực tiếp từ controller hoặc gọi request)
        // Ở đây mình sẽ gọi script fetch đơn giản
        const tokenData = {
            id: 4, // ID của Shipping Manager (shipping@test.com)
            email: 'shipping@test.com',
            role: 'shipping'
        };
        const token = Buffer.from(JSON.stringify(tokenData)).toString('base64');

        const res = await fetch(`http://localhost:5001/api/shipments/${shipment.id}/assign-driver`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                driverId: driver.id,
                vehicleInfo: "Xe tải test 29A-99999"
            })
        });

        const result = await res.json();
        if (res.ok) {
            console.log("✅ Gán tài xế thành công qua API!");
            console.log("Kết quả:", result.message);
            console.log("Trạng thái mới:", result.shipment.status);
        } else {
            console.log("❌ Thất bại:", result.message);
        }

    } catch (error) {
        console.error("Lỗi:", error.message);
    } finally {
        process.exit();
    }
};

testAssignDriver();
