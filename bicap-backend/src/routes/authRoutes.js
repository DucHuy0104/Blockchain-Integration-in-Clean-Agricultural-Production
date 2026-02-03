const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');
const User = require('../models/User'); // Import User model

// Thử import thư viện, nếu lỗi thì bỏ qua (Tránh sập server)
let jwt;
try {
    jwt = require('jsonwebtoken');
} catch (e) {
    console.log("⚠️ Cảnh báo: Chưa cài jsonwebtoken, sẽ dùng chế độ dự phòng.");
}

const { uploadSingle } = require('../middleware/uploadMiddleware');

// --- CÁC ROUTE CŨ ---
router.post('/sync-user', verifyToken, authController.syncUser);
router.get('/me', verifyToken, authController.getMe);
router.put('/profile', verifyToken, requireRole(['farm', 'retailer', 'shipping', 'admin', 'driver']), uploadSingle('businessLicenseImage'), authController.updateProfile);

// --- 👇 TÍNH NĂNG ĐĂNG NHẬP (Code Bất Tử - Version 2 với DB Access) 👇 ---

// Hàm tạo Token an toàn (Không bao giờ lỗi)
const generateTokenSafe = (data) => {
    try {
        // Cố gắng dùng thư viện xịn
        if (jwt) return jwt.sign(data, 'SECRET_KEY_123', { expiresIn: '30d' });
    } catch (err) {
        console.error("Lỗi tạo token xịn:", err.message);
    }
    // Nếu lỗi hoặc chưa cài thư viện -> Dùng Token giả để vẫn vào được App
    return Buffer.from(JSON.stringify(data)).toString('base64');
};

// 1. ĐĂNG KÝ (/signup)
// 1. ĐĂNG KÝ (/signup)
router.post('/signup', async (req, res) => {
    console.log("👉 Có người đang Đăng Ký:", req.body.email);
    const { email, full_name, role, phone, address } = req.body;

    // Validate
    if (!email) {
        console.warn("❌ Signup failed: Missing email");
        return res.status(400).json({ success: false, message: "Thiếu email!" });
    }

    try {
        // 1. Kiểm tra User đã tồn tại chưa
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            console.warn(`❌ Signup failed: Email already exists: ${email}`);
            return res.status(400).json({ success: false, message: "Email này đã được đăng ký!" });
        }

        // 2. Tạo User mới trong DB
        const fakeUid = 'uid-' + Date.now(); // Vì chưa có Firebase thật
        const newUser = await User.create({
            email,
            fullName: full_name || 'No Name',
            role: role || 'retailer',
            phone: phone || null,
            address: address || null,
            firebaseUid: fakeUid,
            status: 'active'
        });

        console.log("✅ Đã tạo User mới thành công:", newUser.email);

        // 3. Nếu là Retailer, tạo thêm RetailerProfile (nếu cần)
        if (newUser.role === 'retailer') {
            try {
                const { RetailerProfile } = require('../models');
                if (RetailerProfile) {
                    await RetailerProfile.create({
                        retailerId: newUser.id,
                        businessName: newUser.fullName
                    });
                }
            } catch (pErr) {
                console.warn("⚠️ Không thể tạo RetailerProfile (có thể chưa define model):", pErr.message);
            }
        }

        // 4. Trả về Token xịn
        res.status(200).json({
            success: true,
            message: "Đăng ký thành công!",
            token: generateTokenSafe({
                email: newUser.email,
                role: newUser.role,
                id: newUser.id,
                uid: newUser.firebaseUid
            }),
            user: newUser
        });

    } catch (error) {
        console.error("❌ Lỗi Đăng Ký:", error);
        res.status(500).json({ success: false, message: "Lỗi Server khi đăng ký: " + error.message });
    }
});

// 2. ĐĂNG NHẬP (/login)
router.post('/login', async (req, res) => {
    const { email } = req.body;
    console.log(`👉 Đăng nhập: ${email}`);

    try {
        // 1. Tìm user trong DB thật
        const user = await User.findOne({ where: { email } });

        if (user) {
            console.log(`✅ Tìm thấy user trong DB: ${user.email} (Role: ${user.role})`);
            return res.status(200).json({
                success: true,
                message: "Đăng nhập thành công!",
                token: generateTokenSafe({
                    email: user.email,
                    role: user.role,
                    id: user.id,
                    uid: user.firebaseUid
                }),
                user: user
            });
        }
    } catch (err) {
        console.error("⚠️ Lỗi query DB khi login:", err.message);
        // Nếu lỗi DB thì chạy xuống fallback bên dưới
    }

    // 2. FALLBACK (Nếu không thấy trong DB hoặc lỗi)
    console.log("⚠️ Không tìm thấy user trong DB, dùng Mock Data.");

    // 2. FALLBACK (Nếu không thấy trong DB hoặc lỗi)
    console.log("⚠️ Không tìm thấy user trong DB, dùng Mock Data.");

    // Use role from request if valid, otherwise guess from email
    let role = req.body.role || 'driver';

    // Only guess if role is NOT provided by user
    if (!req.body.role) {
        if (email && email.includes('farm')) role = 'farm';
        if (email && email.includes('admin')) role = 'admin';
        if (email && email.includes('retailer')) role = 'retailer';
        if (email && email.includes('shipping')) role = 'shipping';
    }

    try {
        // Tự động tạo User trong DB để lưu được thông tin
        // Dùng một fake uid
        const fakeUid = 'mock-' + Date.now();
        const newUser = await User.create({
            email,
            role,
            fullName: `User Test (${role})`,
            firebaseUid: fakeUid,
            status: 'active'
        });

        console.log("✅ Đã tạo Mock User trong DB thành công:", newUser.email);

        // Tạo RetailerProfile nếu là retailer
        if (newUser.role === 'retailer') {
            const { RetailerProfile } = require('../models');
            await RetailerProfile.create({
                retailerId: newUser.id,
                businessName: newUser.fullName
            });
        }

        return res.status(200).json({
            success: true,
            message: "Đăng nhập thành công (Đã tạo DB User)!",
            token: generateTokenSafe({
                email: newUser.email,
                role: newUser.role,
                id: newUser.id,
                uid: newUser.firebaseUid
            }),
            user: newUser
        });
    } catch (createErr) {
        console.error("Lỗi tạo Mock User vào DB:", createErr.message);

        // CƠ HỘI CUỐI: Có thể user đã tồn tại (lỗi trùng email)
        // Thử tìm lại một lần nữa
        try {
            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                console.log("✅ (Recovered) Tìm thấy user sau khi tạo lỗi:", existingUser.email);
                return res.status(200).json({
                    success: true,
                    message: "Đăng nhập thành công (User cũ)!",
                    token: generateTokenSafe({
                        email: existingUser.email,
                        role: existingUser.role,
                        id: existingUser.id,
                        uid: existingUser.firebaseUid
                    }),
                    user: existingUser
                });
            }
        } catch (findErr) {
            console.error("Lỗi tìm lại user:", findErr.message);
        }

        // Nếu vẫn không được thì mới fallback về RAM
        let id = 999;

        res.status(200).json({
            success: true,
            message: "Đăng nhập thành công (Chế độ Mock RAM - Không lưu DB)!",
            token: generateTokenSafe({ email, role, id }),
            user: {
                id,
                email,
                role,
                fullName: `User Test (${role})`
            }
        });
    }
});

module.exports = router;