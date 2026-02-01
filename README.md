# 🌱 BICAP: Blockchain Integration in Clean Agricultural Production

**BICAP** (Blockchain Integration in Clean Agricultural Production) là một giải pháp công nghệ toàn diện nhằm minh bạch hóa chuỗi cung ứng nông sản sạch. Hệ thống kết hợp kỹ thuật **Blockchain (VeChain)**, **IoT**, và **Mobile App** để đảm bảo mọi sản phẩm từ trang trại đến tay người tiêu dùng đều có nguồn gốc rõ ràng, bất biến và đáng tin cậy.

---

## 🚀 Tính năng Cốt lõi & Vai trò

### 🚜 Trang trại (Farm Owner)
- **Quản lý mùa vụ:** Theo dõi toàn bộ quá trình từ gieo hạt đến thu hoạch.
- **Minh bạch Blockchain:** Ghi lại nhật ký canh tác (phân bón, thuốc bảo vệ thực vật) lên mạng lưới **VeChain**.
- **Giám sát IoT:** Theo dõi thời gian thực các chỉ số môi trường qua Dashboard.
- **Sàn giao dịch:** Niêm yết sản phẩm, tải lên hình ảnh sản phẩm và quản lý các đơn đặt hàng.

### 🏢 Quản lý vận chuyển (Shipping Manager)
- **Quản lý Đội xe:** Quản lý danh sách phương tiện (xe tải lạnh, xe tải thường) và trạng thái.
- **Quản lý Tài xế:** Theo dõi danh sách tài xế và hiệu suất.
- **Điều phối Vận đơn:** Chuyển đổi Đơn hàng thành Vận đơn, gán tài xế và phương tiện.
- **Giám sát sự cố:** Tiếp nhận báo cáo sự cố từ tài xế trong quá trình giao hàng.

### 🚚 Tài xế (Driver - Mobile App)
- **App di động (Expo):** Ứng dụng chuyên dụng với tính năng quét **QR Code**.
- **Xác thực giao nhận:** Quét mã tại Farm để nhận hàng và tại Store để giao hàng.
- **Báo cáo sự cố:** Gửi báo cáo kèm phân loại và nhận phản hồi tức thì.

### 🏪 Nhà bán lẻ (Retailer)
- **Sàn thương mại:** Mua nông sản trực tiếp từ trang trại.
- **Truy xuất nguồn gốc:** Quét mã QR để xem toàn bộ lịch sử sản phẩm (từ canh tác đến vận chuyển).
- **Đối soát thanh toán:** Xác nhận nhận hàng và POD (Proof of Delivery).

---

## 🧱 Kiến trúc Công nghệ

| Thành phần | Công nghệ | Mục đích |
| :--- | :--- | :--- |
| **Frontend Web** | Next.js 14, TailwindCSS | Dashboard đa vai trò. |
| **Mobile App** | React Native, Expo | Ứng dụng cho Tài xế. |
| **Backend** | Node.js, Express, Sequelize | Xử lý logic và API. |
| **Database** | Azure SQL Edge (MSSQL) | Lưu trữ dữ liệu tập trung. |
| **Cache Layer** | **Redis** (Docker/Cloud) | Tăng tốc API 10-50x. |
| **Blockchain** | VeChainThor (Mock/TestNet) | Đảm bảo tính bất biến của dữ liệu. |
| **Đóng gói** | Docker & Docker Compose | Triển khai nhất quán. |

---

## ⚡ Performance & Security (NFRs)

Hệ thống đã được tối ưu hóa theo các yêu cầu phi chức năng (Non-Functional Requirements):

- **Redis Caching**: Caching tầng API cho danh sách sản phẩm và chi tiết sản phẩm.
- **Database Indexing**: Tối ưu hóa truy vấn cho các trường `farmId`, `status`, `createdAt`.
- **API Rate Limiting**: Bảo vệ API khỏi tấn công Brute-force và DDoS (100 req/15p tổng quát, 5 req/15p cho Auth).
- **Role-Based Access Control (RBAC)**: Phân quyền chặt chẽ 5 vai trò (Admin, Farm, Retailer, Shipping, Driver).
- **Image Management**: Hỗ trợ upload ảnh sản phẩm trực tiếp và lưu trữ tập trung.

---

## 🔗 Blockchain Integration Note

Đây là một **đồ án học tập (Academic Project)**. 
- **Hiện tại**: Sử dụng **Mock Blockchain Helper** để mô phỏng quy trình ghi dữ liệu lên mạng lưới VeChainThor (tạo hash SHA-256 thực tế, giả lập độ trễ mạng).
- **Sẵn sàng**: Kiến trúc (cấu trúc bảng `txHash`) và infrastructure (`bicap-smart-contracts`) đã sẵn sàng để tích hợp `thor-devkit` và deploy Smart Contracts thật lên TestNet.

---

## 🛠️ Hướng dẫn Vận hành

### 1. Khởi chạy bằng Docker
```bash
# Khởi động toàn bộ: SQL Server, Redis, Backend, Frontend
docker-compose up -d --build
```

**Services:**
- **Web Portal:** [http://localhost:3000](http://localhost:3000)
- **Backend API:** [http://localhost:5001](http://localhost:5001)

### 2. Cấu hình Redis Cloud (Tùy chọn)
Nếu muốn sử dụng Redis Cloud thay cho Docker Redis, cập nhật `.env`:
```bash
REDIS_HOST=your-redis-host
REDIS_PORT=your-port
REDIS_PASSWORD=your-password
```

### 3. Chạy App di động
```bash
cd bicap-mobile-driver
npm install
npx expo start
```

---

## 📂 Cấu trúc Thư mục
- `bicap-backend/`: API Server và cấu hình Database/Redis.
- `bicap-web-client/`: Giao diện Web (Next.js).
- `bicap-mobile-driver/`: App Mobile (Expo).
- `bicap-smart-contracts/`: Infrastructure cho Smart Contracts (Hardhat).

---
**🌱 BICAP - Vì một nền nông nghiệp minh bạch và sạch!**