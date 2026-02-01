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
| **Cache & Queue** | **Redis** (Docker/Cloud) | Tăng tốc API và xử lý Transaction ngầm. |
| **Blockchain** | **VeChainThor (Real/Solo Node)** | Đảm bảo tính bất biến và minh bạch. |
| **Đóng gói** | Docker & Docker Compose | Triển khai nhất quán. |

---

## ⚡ Performance & Security (NFRs)

Hệ thống được thiết kế đáp ứng các tiêu chuẩn công nghiệp:

- **High Concurrency (Blockchain)**: Sử dụng **Bull Queue & Redis** để xử lý giao dịch background, đảm bảo hệ thống ổn định khi dữ liệu IoT tăng đột biến.
- **Data Integrity**: Dữ liệu sản phẩm được băm (Hashing) và lưu trữ trực tiếp lên VeChainThor Smart Contract.
- **Redis Caching**: Tối ưu hóa truy vấn sản phẩm và mùa vụ với độ trễ cực thấp.
- **API Rate Limiting**: Bảo vệ API khỏi tấn công Brute-force và DDoS (100 req/15p).
- **Security**: Mã hóa chữ ký số (secp256k1) cho các giao dịch Blockchain.

---

## 🔗 Blockchain Integration

Hệ thống tích hợp **VeChainThor Blockchain** thực tế:
- **Smart Contract**: `BicapTraceability.sol` lưu trữ lịch sử nguồn gốc sản phẩm.
- **Local Solo Node**: Chạy môi trường Blockchain nội bộ chuyên nghiệp để demo và phát triển.
- **Asynchronous Processing**: Mọi hành động ghi lên chain đều qua hàng đợi xử lý ngầm.

---

## 🛠️ Hướng dẫn Vận hành

### 1. Khởi chạy toàn bộ hệ thống (Docker)
```bash
# Khởi động Backend, DB, Redis và máy chủ Blockchain Solo Node
docker-compose up -d --build
```

**Services:**
- **Web Portal:** [http://localhost:3000](http://localhost:3000)
- **Backend API:** [http://localhost:5001](http://localhost:5001)
- **Blockchain Node:** [http://localhost:8669](http://localhost:8669)

### 2. Kiểm tra & Demo Blockchain
Mở một Terminal mới tại thư mục `bicap-backend` để chạy các script kiểm tra:

```bash
# 1. Kiểm tra số dư ví Admin (Solo Node)
node scripts/check_balance.js

# 2. Demo xử lý đồng thời (Concurrency Test với Bull Queue)
node scripts/test_blockchain_queue.js
```

### 3. Chạy App di động
```bash
cd bicap-mobile-driver
npm install
npx expo start
```

---

## 📂 Cấu trúc Thư mục
- `bicap-backend/`: API Server, Blockchain Helpers & Bull Queue service.
- `bicap-web-client/`: Giao diện Web (Next.js 14).
- `bicap-mobile-driver/`: App Mobile (Expo + QR Scanner).
- `bicap-smart-contracts/`: Smart Contracts (Solidity) và kịch bản Deploy (Hardhat).

---
**🌱 BICAP - Vì một nền nông nghiệp minh bạch và sạch!**