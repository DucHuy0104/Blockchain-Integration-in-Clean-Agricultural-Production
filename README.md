# BICAP: Tích hợp Blockchain trong Sản xuất Nông nghiệp Sạch

BICAP (Blockchain Integration in Clean Agricultural Production) là giải pháp công nghệ toàn diện được thiết kế để nâng cao tính minh bạch trong chuỗi cung ứng nông sản sạch. Hệ thống tích hợp công nghệ Blockchain (VeChain), IoT và ứng dụng di động để đảm bảo mọi sản phẩm từ trang trại đến người tiêu dùng đều có hồ sơ nguồn gốc bất biến và đáng tin cậy.

---

## Tính năng Cốt lõi & Chuyển đổi Doanh nghiệp

### Quản lý Nông trại (Dành cho Chủ Nông trại)
- **Theo dõi Vòng đời Cây trồng:** Giám sát toàn diện quy trình từ khi gieo trồng đến khi thu hoạch.
- **Minh bạch Blockchain:** Ghi lại nhật ký canh tác bao gồm dữ liệu bón phân và kiểm soát sâu bệnh lên mạng lưới VeChain.
- **Giám sát IoT:** Trực quan hóa các chỉ số môi trường theo thời gian thực thông qua bảng điều khiển chuyên dụng.
- **Tích hợp Thị trường:** Đăng bán sản phẩm, quản lý hình ảnh và xử lý đơn hàng.

### Quản lý Vận chuyển & Logistics (Dành cho Quản lý Vận chuyển)
- **Quản trị Đội xe:** Quản lý phương tiện vận chuyển, lịch bảo trì và trạng thái hoạt động.
- **Quản lý Nhân sự:** Theo dõi phân công tài xế và các chỉ số hiệu suất.
- **Điều phối Vận chuyển:** Chuyển đổi đơn hàng thành các chuyến hàng và phân bổ nguồn lực.
- **Giám sát Sự cố:** Tiếp nhận và xử lý báo cáo sự cố từ tài xế theo thời gian thực.

### Vận hành Di động (Dành cho Tài xế)
- **Nền tảng Di động Mạnh mẽ:** Ứng dụng di động chuyên dụng được xây dựng trên Expo với tính năng quét mã QR.
- **Xác thực:** Xác minh điểm nhận và giao hàng thông qua quét mã tốc độ cao.
- **Hệ thống Báo cáo:** Báo cáo sự cố chuẩn hóa với quy trình phản hồi trực tiếp.

### Thương mại & Bán lẻ (Dành cho Nhà Bán lẻ)
- **Tiếp cận Thương mại Điện tử:** Mua nông sản trực tiếp từ các nông trại nguồn.
- **Truy xuất Nguồn gốc:** Quét mã QR để truy cập toàn bộ lịch sử sản phẩm.
- **Đối soát Thanh toán:** Quản lý xác nhận giao hàng và Bằng chứng Giao hàng (POD).

---

## Kiến trúc Kỹ thuật

| Thành phần | Công nghệ | Mục đích |
| :--- | :--- | :--- |
| **Frontend Web** | Next.js 14, TailwindCSS | Bảng điều khiển quản trị đa vai trò |
| **Mobile App** | React Native, Expo | Ứng dụng vận hành cho tài xế |
| **Backend** | Node.js, Express, Sequelize | Xử lý nghiệp vụ và điều phối API |
| **Cơ sở dữ liệu** | Azure SQL Edge (MSSQL) | Lưu trữ dữ liệu tập trung |
| **Cache & Hàng đợi** | Redis (Docker/Cloud) | Tăng tốc API và xử lý tác vụ nền |
| **Blockchain** | VeChainThor (Real/Solo Node) | Lớp minh bạch và bất biến dữ liệu |
| **Containerization** | Docker & Docker Compose | Triển khai môi trường nhất quán |

---

## Hiệu suất Vận hành & Bảo mật

Hệ thống được thiết kế để đáp ứng các tiêu chuẩn về hiệu suất và độ tin cậy của ngành:

- **Xử lý Tác vụ Bất đồng bộ:** Sử dụng Bull Queue và Redis cho các giao dịch nền đảm bảo sự ổn định khi tải dữ liệu cao.
- **Tiêu chuẩn Toàn vẹn Dữ liệu:** Dữ liệu sản phẩm được băm (hashing) và lưu trữ trực tiếp trên Hợp đồng Thông minh VeChainThor để ngăn chặn giả mạo.
- **Tối ưu hóa Caching:** Triển khai Redis đảm bảo độ trễ cực thấp cho các truy vấn dữ liệu sản phẩm và mùa vụ.
- **Giới hạn Tốc độ API:** Bảo vệ chống lại các mối đe dọa tự động thông qua chính sách giới hạn 100 yêu cầu mỗi 15 phút.
- **Bảo mật Giao dịch:** Mã hóa chữ ký số Secp256k1 cho tất cả các hoạt động blockchain.

---

## Hướng dẫn Vận hành Hệ thống

### 1. Triển khai Toàn cục qua Docker (Khuyên dùng)
Để khởi tạo tất cả các dịch vụ bao gồm Backend, Database, Redis và Blockchain Solo Node:

```bash
docker-compose up -d --build
```

**Các điểm truy cập dịch vụ:**
- **Web Portal:** http://localhost:3000
- **Backend API:** http://localhost:5001
- **Blockchain Node:** http://localhost:8669

### 2. Xác thực Blockchain
Các kịch bản quản trị để xác thực blockchain nằm trong thư mục `bicap-backend`:

```bash
# Kiểm tra số dư ví quản trị (Solo Node)
node scripts/check_balance.js

# Thực thi xác thực đồng thời (Kiểm tra hàng đợi)
node scripts/test_blockchain_queue.js
```

### 3. Chạy Ứng dụng Di động
```bash
cd bicap-mobile-driver
npm install
npx expo start
```

---

## Cấu trúc Thư mục
- `bicap-backend/`: API Server, Blockchain Helpers và Background Workers.
- `bicap-web-client/`: Giao diện Web chính (Next.js 14).
- `bicap-mobile-driver/`: Mã nguồn ứng dụng di động (Expo).
- `bicap-smart-contracts/`: Smart Contracts Solidity và cấu hình triển khai Hardhat.

---

**BICAP - Đảm bảo Minh bạch và Toàn vẹn trong Sản xuất Nông nghiệp.**