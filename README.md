# 🌱 BICAP – Blockchain Integration in Clean Agricultural Production

**Tích hợp Blockchain vào Quy trình Sản xuất Nông nghiệp sạch**

**BICAP** là hệ thống ứng dụng công nghệ Blockchain nhằm theo dõi, truy xuất nguồn gốc nông sản sạch, đảm bảo tính **Minh bạch – An toàn – Toàn vẹn dữ liệu** trong suốt chuỗi cung ứng nông nghiệp, từ trang trại đến bàn ăn.

---

## 🎯 Mục tiêu Dự án

* ✅ **Quản lý toàn trình:** Theo dõi quy trình canh tác, sản xuất nông nghiệp sạch.
* ✅ **Truy xuất nguồn gốc:** Minh bạch hóa thông tin sản phẩm thông qua mã QR.
* ✅ **Bằng chứng số:** Ghi nhận hash dữ liệu lên Blockchain (VeChain) để chống gian lận.
* ✅ **Kết nối hệ sinh thái:** Farm (Nông trại) – Retailer (Nhà bán lẻ) – Driver (Vận chuyển) – Admin.
* ✅ **Niềm tin người dùng:** Giúp người tiêu dùng an tâm về nguồn gốc thực phẩm.

---

## 🧱 Kiến trúc Công nghệ

| Thành phần | Công nghệ sử dụng | Ghi chú |
| :--- | :--- | :--- |
| **Backend** | Node.js, Express, Sequelize | API & Logic xử lý |
| **Database** | SQL Server (MSSQL) | Lưu trữ dữ liệu off-chain |
| **Blockchain** | VeChain (Thor) | Lưu trữ Hash & TxHash |
| **Web Client** | Next.js 14+ (App Router), TypeScript | Admin, Farm, Retailer |
| **Mobile App** | React Native (Expo) | Dành cho Tài xế |
| **Smart Contract**| Solidity | (Tùy chọn) Logic ghi vết |

---

## ⚙️ Yêu cầu Môi trường

1.  **Node.js**: v18.x trở lên.
2.  **Database**: SQL Server 2019+ (Đã chạy script `BICAP.sql`).
3.  **Mobile Environment**: Expo Go (trên điện thoại) hoặc Android Emulator/iOS Simulator.
4.  **Blockchain Tools**: VeChain Thor DevKit (hoặc Hardhat nếu deploy contract riêng).

---

📂 Cấu trúc Tổng thể (Project Root)
BICAP-System/
│
├── 📂 bicap-backend/           # Server NodeJS + SQL Server + Blockchain Logic
├── 📂 bicap-web-client/        # Web App (Next.js) cho Admin, Farm, Retailer
├── 📂 bicap-mobile-driver/     # App Mobile (React Native) cho Tài xế
├── 📂 bicap-smart-contracts/   # (Optional) Chứa code Solidity & Script deploy VeChain
└── README.md                   # Hướng dẫn chạy toàn bộ dự án

---

1. 📂 Backend (Node.js + Express + Sequelize)
Đây là "bộ não" xử lý dữ liệu, kết nối SQL Server và ghi hash lên Blockchain.

bicap-backend/
├── .env                        # Cấu hình: DB_HOST, JWT_SECRET, VECHAIN_URL
├── package.json
├── server.js                   # Entry point (Chạy server)
├── 📂 src/
│   ├── 📂 config/
│   │   ├── database.js         # Cấu hình kết nối SQL Server
│   │   └── vechain.js          # Cấu hình kết nối Node VeChain
│   │
│   ├── 📂 models/              # Định nghĩa các bảng (ORM)
│   │   ├── index.js            # Khởi tạo quan hệ (Associations)
│   │   ├── User.js
│   │   ├── FarmProfile.js
│   │   ├── FarmingSeason.js    # Chứa cột BlockchainTxHash
│   │   └── ...
│   │
│   ├── 📂 controllers/         # Logic xử lý nghiệp vụ
│   │   ├── authController.js   # Login/Register
│   │   ├── farmController.js   # Tạo mùa vụ, cập nhật quy trình
│   │   ├── orderController.js  # Xử lý đơn hàng
│   │   └── iotController.js    # Nhận dữ liệu cảm biến
│   │
│   ├── 📂 routes/              # Định nghĩa API Endpoint
│   │   ├── authRoutes.js
│   │   ├── farmRoutes.js
│   │   └── ...
│   │
│   ├── 📂 middlewares/         # Các lớp kiểm soát trung gian
│   │   ├── authMiddleware.js   # Kiểm tra Token đăng nhập
│   │   └── uploadMiddleware.js # Xử lý upload ảnh (Multer)
│   │
│   ├── 📂 utils/               # Các hàm tiện ích
│   │   ├── blockchainHelper.js # Hàm ký và gửi transaction VeChain
│   │   ├── qrGenerator.js      # Hàm tạo mã QR
│   │   └── emailSender.js      # Gửi email thông báo
│   │
│   └── 📂 services/            # (Optional) Tách logic phức tạp khỏi Controller
│       └── cronJobService.js   # Tự động quét trạng thái Blockchain

📌 Blockchain Usage

Dữ liệu chi tiết được lưu off-chain (SQL Database)

Hash SHA256 của dữ liệu mùa vụ được ghi lên VeChain

Transaction Hash (TxHash) được lưu ngược lại vào Database để đối soát

---

2. 📂 Web Client (Next.js + TypeScript)
Giao diện cho các đối tượng sử dụng trên máy tính/trình duyệt.

bicap-web-client/
├── .env.local                  # Biến môi trường: NEXT_PUBLIC_API_URL
├── package.json
├── next.config.ts
├── tailwind.config.ts
└── src/
    ├── app/                    # Routing mới (Mỗi folder là 1 đường dẫn)
    │   ├── layout.tsx          # Layout chung cho toàn web
    │   ├── page.tsx            # Trang chủ (Guest/Landing Page)
    │   ├── login/              # Trang đăng nhập
    │   │   └── page.tsx
    │   │
    │   ├── admin/              # Khu vực Admin
    │   │   ├── layout.tsx      # Sidebar riêng cho Admin
    │   │   └── dashboard/      # /admin/dashboard
    │   │       └── page.tsx
    │   │
    │   ├── farm/               # Khu vực Farm Owner
    │   │   ├── layout.tsx
    │   │   ├── dashboard/
    │   │   │   └── page.tsx
    │   │   └── seasons/        # Quản lý mùa vụ
    │   │       ├── create/
    │   │       │   └── page.tsx
    │   │       └── [id]/       # Chi tiết mùa vụ (Dynamic Route)
    │   │           └── page.tsx
    │   │
    │   └── retailer/           # Khu vực Retailer
    │       └── ...
    │
    ├── components/             # UI Components tái sử dụng
    │   ├── ui/                 # Button, Input, Card (Của Ant Design/Tailwind)
    │   ├── layout/             # Header, Footer, Sidebar
    │   └── maps/               # Bản đồ
    │
    ├── services/               # Gọi API (Axios)
    │   ├── api.ts              # Cấu hình Axios Instance
    │   └── authService.ts
    │
    ├── types/                  # TypeScript Interfaces (Quan trọng)
    │   └── index.ts            # Định nghĩa User, Season, Product
    │
    └── utils/                  # Hàm phụ trợ
        └── format.ts           # Format tiền tệ, ngày tháng

Chức năng chính

Quản lý người dùng & phân quyền

Tạo và theo dõi mùa vụ nông nghiệp

Quản lý đơn hàng

Truy xuất nguồn gốc qua QR Code

Hiển thị biểu đồ dữ liệu môi trường (IoT)

3. 📂 Mobile App (React Native - Expo)
Dành riêng cho Tài xế (Ship Driver) để tiện di chuyển và quét mã.

bicap-mobile-driver/
├── App.js                      # Entry point
├── app.json                    # Cấu hình Expo
├── package.json
├── 📂 src/
│   ├── 📂 components/          # Button, Card đơn hàng
│   ├── 📂 screens/             # Các màn hình
│   │   ├── LoginScreen.js
│   │   ├── HomeScreen.js       # Danh sách chuyến hàng cần giao
│   │   ├── MapScreen.js        # Bản đồ đường đi
│   │   ├── QRCodeScanner.js    # Quét mã khi nhận/giao hàng
│   │   └── ProfileScreen.js
│   │
│   ├── 📂 navigation/          # Cấu hình Stack/Tab Navigator
│   │   ├── AppNavigator.js
│   │   └── AuthNavigator.js
│   │
│   ├── 📂 services/            # API Calls (Có thể copy logic từ Web Client)
│   │   └── api.js
│   │
│   └── 📂 utils/               # Hàm định dạng ngày tháng, tiền tệ

Chức năng
Nhận danh sách đơn hàng cần giao

Xem lộ trình trên bản đồ

Quét QR khi nhận và giao hàng

Xác nhận trạng thái vận chuyển


4. 📂 Smart Contracts (VeChain/Solidity)
Phần này chứa mã nguồn Blockchain (nếu bạn tự viết contract thay vì dùng API có sẵn).

bicap-smart-contracts/
├── contracts/
│   ├── BicapTraceability.sol   # Contract lưu vết sản phẩm
│   └── BicapToken.sol          # (Optional) Nếu có dùng token thanh toán
├── scripts/
│   └── deploy.js               # Script deploy lên VeChain Testnet
├── test/                       # Test case cho Smart Contract
└── hardhat.config.js           # Hoặc truffle-config.js

## Hướng dẫn chạy dự án (Local)

### 1. Backend
```bash
cd bicap-backend
npm install
npm run dev
```

### 2. Web Client
```bash
cd bicap-web-client
npm install
npm run dev
```

### 3. Mobile App
```bash
cd bicap-mobile-driver
npm install
expo start
```
📌 Ghi chú
Dự án sử dụng JWT Authentication

Có thể tích hợp IoT sensor gửi dữ liệu realtime

Blockchain chỉ lưu hash để tối ưu chi phí & hiệu năng