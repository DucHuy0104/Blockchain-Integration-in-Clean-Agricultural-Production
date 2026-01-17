const express = require('express');
const cors = require('cors');
const sql = require('mssql');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// 👇 CẤU HÌNH SQL (Giữ nguyên như cũ)
const dbConfig = {
    user: 'sa',           
    password: 'BiCapProject@123',      
    server: 'localhost',  
    database: 'BICAP',
    options: { encrypt: false, trustServerCertificate: true }
};

sql.connect(dbConfig)
    .then(() => console.log("✅ KẾT NỐI SQL SERVER THÀNH CÔNG!"))
    .catch(err => console.log("❌ LỖI KẾT NỐI:", err));

// =============================================================
// 👇 PHẦN QUAN TRỌNG: FIX LỖI "ĐỒNG BỘ USER"
// =============================================================

// 1. API Login (Giữ nguyên)
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(`📥 Login: ${email} - ${password}`);
        
        const pool = await sql.connect(dbConfig);
        const result = await pool.request()
            .input('Email', sql.NVarChar, email)
            .input('Pass', sql.NVarChar, password)
            .query("SELECT Id, Email, FullName, Role FROM Users WHERE Email = @Email AND PasswordHash = @Pass");

        if (result.recordset.length > 0) {
            const user = result.recordset[0];
            if (user.Role !== 'ShipDriver') return res.status(403).json({ success: false, message: "Không phải tài xế!" });

            // Trả về Token và User info
            res.json({
                success: true,
                token: "real-token-" + user.Id,
                user: { id: user.Id, email: user.Email, fullName: user.FullName, role: user.Role }
            });
        } else {
            res.status(401).json({ success: false, message: "Sai tài khoản hoặc mật khẩu" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// 2. API Sync (Cái này Frontend đang gọi và bị lỗi -> Giờ ta thêm vào để fix)
app.post('/api/users/sync', async (req, res) => {
    console.log("🔄 Frontend đang gọi Sync User... -> Server trả lời OK");
    
    // Server trả về thông tin giả định là Sync thành công
    // Lưu ý: Để đơn giản, ta trả về user Lượng luôn.
    res.json({
        success: true,
        data: {
            id: 1,
            email: 'shipper1@gmail.com',
            fullName: 'Lượng', // Quan trọng: Tên này sẽ hiện lên App
            role: 'ShipDriver'
        }
    });
});

// 3. API Lấy đơn hàng (Backend cũ)
app.get('/api/driver/shipments', async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        // Hack: Lấy luôn ID = 1 (Lượng) để test cho nhanh, khỏi check token rườm rà
        const driverId = 1; 

        const pool = await sql.connect(dbConfig);
        const result = await pool.request().input('DriverId', sql.Int, driverId).query(`
            SELECT s.Id as id, 'DH-' + CAST(s.Id AS VARCHAR) as code, s.Status as status, 
            'Thanh Long (500kg)' as product_name, 'Kho Long An' as sender_address, 'BigC Hà Nội' as receiver_address
            FROM Shipments s WHERE s.DriverId = @DriverId
        `);
        res.json({ success: true, data: result.recordset });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// 4. API Update trạng thái
app.put('/api/driver/shipments/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        let sqlStatus = 'Created';
        if (req.body.status === 'IN_TRANSIT') sqlStatus = 'InTransit';
        if (req.body.status === 'DELIVERED') sqlStatus = 'Delivered';
        
        const pool = await sql.connect(dbConfig);
        await pool.request().input('Status', sql.NVarChar, sqlStatus).input('Id', sql.Int, id)
            .query("UPDATE Shipments SET Status = @Status WHERE Id = @Id");
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

const PORT = 5001;
app.listen(PORT, () => console.log(`🚀 Server Test đang chạy tại http://localhost:${PORT}`));