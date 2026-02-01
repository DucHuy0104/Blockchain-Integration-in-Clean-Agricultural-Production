# 🌱 BICAP: Blockchain Integration in Clean Agricultural Production

**BICAP** (Blockchain Integration in Clean Agricultural Production) là một giải pháp công nghệ toàn diện nhằm minh bạch hóa chuỗi cung ứng nông sản sạch. Hệ thống kết hợp kỹ thuật **Blockchain (VeChain)**, **IoT**, và **Mobile App** để đảm bảo mọi sản phẩm từ trang trại đến tay người tiêu dùng đều có nguồn gốc rõ ràng, bất biến và đáng tin cậy.

---

## 🚀 Tính năng Cốt lõi & Vai trò

### 🚜 Trang trại (Farm Owner)
- **Quản lý mùa vụ:** Theo dõi toàn bộ quá trình từ gieo hạt đến thu hoạch.
- **Minh bạch Blockchain:** Ghi lại nhật ký canh tác (phân bón, thuốc bảo vệ thực vật) lên mạng lưới **VeChain**.
- **Giám sát IoT:** Theo dõi thời gian thực các chỉ số môi trường qua Dashboard.
- **Sàn giao dịch:** Niêm yết sản phẩm và quản lý các đơn đặt hàng từ Nhà bán lẻ.

### 🏢 Quản lý vận chuyển (Shipping Manager) - *Cập nhật mới*
- **Quản lý Đội xe:** Quản lý danh sách phương tiện (xe tải lạnh, xe tải thường) và trạng thái hoạt động.
- **Quản lý Tài xế:** Theo dõi danh sách tài xế, trạng thái (Sẵn sàng/Bận) và hiệu suất làm việc.
- **Điều phối Vận đơn:** Chuyển đổi Đơn hàng thành Vận đơn, gán tài xế và phương tiện phù hợp.
- **Giám sát sự cố:** Tiếp nhận và phản hồi các báo cáo sự cố (Incident Reports) từ tài xế trong quá trình giao hàng.

### 🚚 Tài xế (Driver - Web & Mobile App) - *Cập nhật mới*
- **App di động (Expo):** Ứng dụng chuyên dụng cho tài xế di chuyển trên đường.
- **Xác thực QR Code:**
    - **Quét nhận hàng tại Farm:** Hiển thị thông tin sản phẩm (Tên, Trại, Khối lượng) để đối soát trước khi nhận.
    - **Quét giao hàng tại Store:** Xác nhận hoàn tất quy trình giao hàng.
- **Luồng trạng thái:** Quy trình chuẩn: **Gán** -> **Nhận hàng (QR)** -> **Bắt đầu vận chuyển** -> **Giao hàng (QR)**.
- **Báo cáo sự cố:** Gửi báo cáo kèm phân loại (Giao thông, Xe cộ, Sự cố khác) và nhận phản hồi từ quản lý ngay trên App.

### 🏪 Nhà bán lẻ (Retailer)
- **Tìm nguồn hàng:** Mua trực tiếp nông sản sạch từ các trang trại uy tín.
- **Truy xuất nguồn gốc:** Quét mã QR Vận đơn để xem toàn bộ "cuộc đời" của sản phẩm từ lúc gieo hạt đến lúc vận chuyển.
- **Đối soát thanh toán:** Thanh toán tiền cọc và xác nhận nhận hàng thông qua hình ảnh POD (Proof of Delivery).

---

## 🧱 Kiến trúc Công nghệ

| Thành phần | Công nghệ | Mục đích |
| :--- | :--- | :--- |
| **Frontend Web** | Next.js 14+ (App Router), TailwindCSS | Dashboard quản lý cho Farm, Shipping, Retailer. |
| **Mobile App** | React Native, Expo, Expo Router, Expo Camera | Ứng dụng hiện trường cho Tài xế. |
| **Backend** | Node.js, Express, Sequelize (ORM) | Xử lý API, Auth, và Logic nghiệp vụ. |
| **Database** | Azure SQL Edge (MSSQL) | Lưu trữ dữ liệu hệ thống tập trung. |
| **Blockchain** | VeChain (Thor) | Lưu trữ mã băm dữ liệu truy xuất nguồn gốc. |
| **Đóng gói** | Docker & Docker Compose | Triển khai nhất quán toàn bộ hệ thống. |

---

## 🛠️ Hướng dẫn Vận hành

### 1. Khởi chạy toàn bộ hệ thống bằng Docker (Khuyên dùng)
Đảm bảo bạn đã cài đặt Docker Desktop.

```bash
# Khởi động Database, Backend và Frontend
docker-compose up -d --build
```

- **Web Portal:** [http://localhost:3000](http://localhost:3000)
- **API Server:** [http://localhost:5001](http://localhost:5001)

### 2. Chạy ứng dụng di động cho Tài xế (Expo)
Vào thư mục `bicap-mobile-driver`:
```bash
npm install
# Sửa IP máy tính bạn trong constants/Config.ts
npx expo start
```
Dùng điện thoại cài sẵn **Expo Go** để quét mã QR và trải nghiệm.

### 3. Quy trình thử nghiệm chuẩn (End-to-End)
1.  **Farm**: Đăng nhập (`farm@test.com`) -> Tạo sản phẩm -> Đưa lên sàn.
2.  **Retailer**: Đăng nhập (`retailer@test.com`) -> Đặt mua sản phẩm -> Thanh toán cọc.
3.  **Shipping Manager**: Đăng nhập (`shipping@test.com`) -> Vào "Vận đơn" -> Gán tài xế `driver@test.com` và xe cho đơn hàng.
4.  **Driver (Mobile)**: Đăng nhập (`driver@test.com`) -> Thấy đơn hàng -> Quét mã QR (lấy từ trang Quản lý Web) để Nhận hàng -> Bắt đầu vận chuyển -> Quét QR để Giao hàng.
5.  **Retailer**: Xác nhận đã nhận hàng và hoàn tất thanh toán.

---

## 📂 Cấu trúc Thư mục
- `bicap-backend/`: Mã nguồn server API và scripts khởi tạo dữ liệu.
- `bicap-web-client/`: Giao diện Web đa vai trò (Next.js).
- `bicap-mobile-driver/`: Ứng dụng di động Expo cho tài xế.
- `bicap-smart-contracts/`: Các hợp đồng thông minh lưu trữ Blockchain.
- `docker-compose.yml`: Cấu hình chạy toàn bộ hệ thống trong 1 lệnh.

---

## ⚠️ Lưu ý & Bảo trì
- **Dữ liệu**: Nếu muốn reset lại toàn bộ dữ liệu mẫu, chạy `docker-compose down -v` sau đó chạy lại lệnh khởi động.
- **Firebase**: Hệ thống sử dụng Firebase Auth cho môi trường Production, trong môi trường Dev sử dụng JWT giả lập để thuận tiện thử nghiệm.

---
**🌱 BICAP - Vì một nền nông nghiệp minh bạch và sạch!**