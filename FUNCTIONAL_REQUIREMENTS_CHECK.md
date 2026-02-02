# 📋 Kiểm tra Chức năng theo Yêu cầu

## 1️⃣ Quản lý Trang trại (Farm Management – Web App)

| STT | Chức năng | Trạng thái | Ghi chú |
|-----|-----------|------------|---------|
| 1.1 | Đăng ký và đăng nhập tài khoản | ✅ **CÓ** | `authRoutes.js` - `/register`, `/login` |
| 1.2 | Cập nhật thông tin cá nhân của chủ sở hữu | ⚠️ **THIẾU** | Chưa có route riêng, có thể dùng User update |
| 1.3 | Cập nhật Giấy phép kinh doanh và thông tin trang trại | ✅ **CÓ** | `farmRoutes.js` - `PUT /:id` |
| 1.4 | Mua gói dịch vụ để sử dụng hệ thống | ✅ **CÓ** | `subscriptionRoutes.js` - `POST /subscribe` |
| 1.5 | Thanh toán khi mua gói dịch vụ | ✅ **CÓ** | `paymentRoutes.js` - Tích hợp VNPay |
| 1.6 | Xem các quy trình của các vụ mùa canh tác | ✅ **CÓ** | `seasonRoutes.js` - `GET /:seasonId` |
| 1.7 | Xem chi tiết các vụ mùa canh tác | ✅ **CÓ** | `seasonRoutes.js` - `GET /:seasonId` |
| 1.8 | Tạo vụ mùa canh tác (lưu blockchain) | ✅ **CÓ** | `seasonRoutes.js` - `POST /` + blockchain queue |
| 1.9 | Cập nhật quy trình của vụ mùa (lưu blockchain) | ✅ **CÓ** | `seasonRoutes.js` - `POST /:seasonId/process` |
| 1.10 | Xuất (export) thông tin vụ mùa canh tác | ✅ **CÓ** | `seasonRoutes.js` - `POST /:seasonId/export` |
| 1.11 | Tạo mã QR cho mỗi lần xuất vụ mùa (lưu blockchain) | ✅ **CÓ** | `seasonRoutes.js` - `GET /:seasonId/qr-code` |
| 1.12 | Đăng ký đưa sản phẩm lên sàn giao dịch | ✅ **CÓ** | `productRoutes.js` - `POST /` |
| 1.13 | Xem danh sách đăng ký đưa lên sàn giao dịch | ✅ **CÓ** | `productRoutes.js` - `GET /farm/:farmId` |
| 1.14 | Xử lý các yêu cầu mua nông sản từ Retailers | ✅ **CÓ** | `orderRoutes.js` - `PUT /:id/status` |
| 1.15 | Xem thông tin Nhà bán lẻ đã ký hợp đồng | ⚠️ **THIẾU** | Có thể xem qua Order nhưng chưa có endpoint riêng |
| 1.16 | Xem danh sách và xem chi tiết quy trình vận chuyển | ✅ **CÓ** | `shipmentRoutes.js` - `GET /farm/:farmId` |
| 1.17 | Xem báo cáo của các quy trình vận chuyển | ✅ **CÓ** | `reportRoutes.js` - `GET /` |
| 1.18 | Nhận thông báo về báo cáo từ Retailer | ✅ **CÓ** | `notificationRoutes.js` - Tự động khi có report |
| 1.19 | Nhận thông báo về báo cáo từ Shipper | ✅ **CÓ** | `notificationRoutes.js` - Tự động khi có report |
| 1.20 | Nhận thông báo về nhiệt độ, độ ẩm, pH trong ngày | ⚠️ **THIẾU** | Có monitoring nhưng chưa có notification tự động |
| 1.21 | Gửi báo cáo cho Admin | ✅ **CÓ** | `reportRoutes.js` - `POST /` |

**Tổng kết Farm Management: 18/21 ✅ (85.7%)**

---

## 2️⃣ Nhà bán lẻ (Retailer – Web App)

| STT | Chức năng | Trạng thái | Ghi chú |
|-----|-----------|------------|---------|
| 2.1 | Đăng ký và đăng nhập tài khoản | ✅ **CÓ** | `authRoutes.js` - `/register`, `/login` |
| 2.2 | Cập nhật thông tin cá nhân của chủ sở hữu | ⚠️ **THIẾU** | Chưa có route riêng |
| 2.3 | Cập nhật Giấy phép kinh doanh và thông tin | ⚠️ **THIẾU** | Chưa có model/route cho Retailer profile |
| 2.4 | Tìm kiếm sản phẩm nông nghiệp trên sàn giao dịch | ✅ **CÓ** | `publicRoutes.js` - `GET /products` (có filter) |
| 2.5 | Xem chi tiết sản phẩm nông nghiệp | ✅ **CÓ** | `publicRoutes.js` - `GET /products/:id` |
| 2.6 | Quét mã QR để truy xuất thông tin sản phẩm | ✅ **CÓ** | `publicRoutes.js` - `GET /traceability/product/:id` |
| 2.7 | Tạo yêu cầu đặt mua nông sản | ✅ **CÓ** | `orderRoutes.js` - `POST /` |
| 2.8 | Thanh toán tiền đặt cọc để đặt mua nông sản | ✅ **CÓ** | `orderRoutes.js` - `PUT /:id/pay-deposit` |
| 2.9 | Hủy yêu cầu đặt mua nông sản | ✅ **CÓ** | `orderRoutes.js` - `PUT /:id/cancel` |
| 2.10 | Xem lịch sử đơn hàng | ✅ **CÓ** | `orderRoutes.js` - `GET /my-orders` |
| 2.11 | Xem chi tiết và trạng thái yêu cầu mua | ✅ **CÓ** | `orderRoutes.js` - `GET /my-orders` (bao gồm chi tiết) |
| 2.12 | Nhận thông báo từ phía Quản lý Trang trại | ✅ **CÓ** | `notificationRoutes.js` - Tự động |
| 2.13 | Gửi thông báo cho phía Quản lý Trang trại | ✅ **CÓ** | `notificationRoutes.js` - `POST /send` |
| 2.14 | Xem danh sách và xem chi tiết quy trình vận chuyển | ⚠️ **THIẾU** | Chưa có route riêng cho Retailer xem shipment |
| 2.15 | Nhận thông báo từ Người vận chuyển | ✅ **CÓ** | `notificationRoutes.js` - Tự động |
| 2.16 | Xác nhận hàng đã được vận chuyển đầy đủ | ✅ **CÓ** | `orderRoutes.js` - `PUT /:id/confirm-delivery` |
| 2.17 | Tải ảnh lên về sản phẩm đã được giao đầy đủ | ✅ **CÓ** | `orderRoutes.js` - `PUT /:id/confirm-delivery` (có upload) |
| 2.18 | Nhận thông báo từ người vận chuyển | ✅ **CÓ** | `notificationRoutes.js` - Tự động |
| 2.19 | Gửi báo cáo cho Admin | ✅ **CÓ** | `reportRoutes.js` - `POST /` |

**Tổng kết Retailer: 16/19 ✅ (84.2%)**

---

## 3️⃣ Tài xế vận chuyển (Ship Driver – Web App)

| STT | Chức năng | Trạng thái | Ghi chú |
|-----|-----------|------------|---------|
| 3.1 | Xem danh sách và xem chi tiết các chuyến giao hàng | ✅ **CÓ** | `driverRoutes.js` - `GET /shipments`, `GET /shipments/:id` |
| 3.2 | Cập nhật trạng thái/quy trình của chuyến vận chuyển | ✅ **CÓ** | `driverRoutes.js` - `PUT /shipments/:id/status` |
| 3.3 | Quét mã QR để theo dõi thông tin sản phẩm khi đến trang trại | ✅ **CÓ** | `driverRoutes.js` - `POST /confirm-pickup` (có QR validation) |
| 3.4 | Xác nhận đã nhận hàng đầy đủ | ✅ **CÓ** | `driverRoutes.js` - `POST /confirm-pickup` |
| 3.5 | Xác nhận đã giao hàng đầy đủ cho nhà bán lẻ | ✅ **CÓ** | `driverRoutes.js` - `POST /confirm-delivery` |
| 3.6 | Gửi báo cáo cho Quản lý Vận chuyển | ✅ **CÓ** | `reportRoutes.js` - `POST /` |

**Tổng kết Ship Driver: 6/6 ✅ (100%)**

---

## 4️⃣ Quản lý Vận chuyển (Shipping Manager – Web App)

| STT | Chức năng | Trạng thái | Ghi chú |
|-----|-----------|------------|---------|
| 4.1 | Xem các đơn hàng thành công giữa Retailer và Farm | ✅ **CÓ** | `shipmentRoutes.js` - `GET /orders-ready` |
| 4.2 | Tạo chuyến vận chuyển cho mỗi đơn hàng thành công | ✅ **CÓ** | `shipmentRoutes.js` - `POST /` |
| 4.3 | Hủy chuyến vận chuyển đã tạo | ✅ **CÓ** | `shipmentRoutes.js` - `PUT /:id/cancel` |
| 4.4 | Xem quy trình/trạng thái của chuyến vận chuyển | ✅ **CÓ** | `shipmentRoutes.js` - `GET /` |
| 4.5 | Quản lý phương tiện vận chuyển (CRUD) | ✅ **CÓ** | `vehicleRoutes.js` - Đầy đủ CRUD |
| 4.6 | Quản lý tài xế vận chuyển (CRUD) | ✅ **CÓ** | `driverRoutes.js` - Đầy đủ CRUD |
| 4.7 | Gửi báo cáo cho Admin | ✅ **CÓ** | `reportRoutes.js` - `POST /` |
| 4.8 | Gửi thông báo cho Farm và Retailer | ✅ **CÓ** | `notificationRoutes.js` - `POST /send` |
| 4.9 | Xem báo cáo từ Tài xế vận chuyển | ✅ **CÓ** | `reportRoutes.js` - `GET /` (filter theo sender) |

**Tổng kết Shipping Manager: 9/9 ✅ (100%)**

---

## 5️⃣ Quản trị viên (Admin – Web App)

| STT | Chức năng | Trạng thái | Ghi chú |
|-----|-----------|------------|---------|
| 5.1 | Tạo, xem, chỉnh sửa và xóa các tài khoản admin khác | ✅ **CÓ** | `adminRoutes.js` - CRUD users với role check |
| 5.2 | Phân quyền và gán vai trò khi cần | ✅ **CÓ** | `adminRoutes.js` - `PUT /users/:id` (có role field) |
| 5.3 | Xem, phê duyệt hoặc từ chối đăng ký trang trại mới | ✅ **CÓ** | `adminRoutes.js` - `PUT /farms/:id/approve` |
| 5.4 | Truy cập và quản lý chi tiết trang trại | ✅ **CÓ** | `adminRoutes.js` - `GET /farms`, `GET /farms/:id` |
| 5.5 | Giám sát tất cả sản phẩm được đăng ký | ✅ **CÓ** | `adminRoutes.js` - `GET /products` |
| 5.6 | Quản lý danh mục sản phẩm, mô tả | ✅ **CÓ** | `adminRoutes.js` - `PUT /products/:id` |
| 5.7 | Triển khai, cập nhật và quản lý smart contract | ✅ **CÓ** | `adminRoutes.js` - `POST /blockchain/deploy`, `GET /blockchain/status` |

**Tổng kết Admin: 7/7 ✅ (100%)**

---

## 6️⃣ Khách (Guest – Web Application/Mobile App)

| STT | Chức năng | Trạng thái | Ghi chú |
|-----|-----------|------------|---------|
| 6.1 | Nhận các thông báo chung về nền tảng | ⚠️ **THIẾU** | Chưa có hệ thống thông báo công khai cho Guest |
| 6.2 | Tìm kiếm và lọc sản phẩm | ✅ **CÓ** | `publicRoutes.js` - `GET /products` (có query params) |
| 6.3 | Truy cập bài viết, video giáo dục | ✅ **CÓ** | Frontend có `/guest/education` pages |

**Tổng kết Guest: 2/3 ✅ (66.7%)**

---

## 📊 TỔNG KẾT TỔNG THỂ

| Role | Số chức năng yêu cầu | Số chức năng đã có | Tỷ lệ |
|------|---------------------|-------------------|-------|
| **Farm Management** | 21 | 18 | **85.7%** ✅ |
| **Retailer** | 19 | 16 | **84.2%** ✅ |
| **Ship Driver** | 6 | 6 | **100%** ✅ |
| **Shipping Manager** | 9 | 9 | **100%** ✅ |
| **Admin** | 7 | 7 | **100%** ✅ |
| **Guest** | 3 | 2 | **66.7%** ⚠️ |
| **TỔNG CỘNG** | **65** | **58** | **89.2%** ✅ |

---

## ⚠️ CÁC CHỨC NĂNG CÒN THIẾU

### 1. Farm Management (3 chức năng)
- **1.2**: Cập nhật thông tin cá nhân của chủ sở hữu (cần route riêng)
- **1.15**: Xem thông tin Nhà bán lẻ đã ký hợp đồng (cần endpoint riêng)
- **1.20**: Nhận thông báo về nhiệt độ, độ ẩm, pH trong ngày (cần notification tự động từ monitoring)

### 2. Retailer (3 chức năng)
- **2.2**: Cập nhật thông tin cá nhân của chủ sở hữu
- **2.3**: Cập nhật Giấy phép kinh doanh và thông tin (cần model RetailerProfile)
- **2.14**: Xem danh sách và xem chi tiết quy trình vận chuyển (cần route riêng)

### 3. Guest (1 chức năng)
- **6.1**: Nhận các thông báo chung về nền tảng (cần hệ thống thông báo công khai)

---

## 🔗 KIỂM TRA LOGIC KẾT NỐI GIỮA CÁC THÀNH PHẦN

### ✅ Logic đã kết nối đúng:

1. **Farm → Product → Order → Shipment → Driver**
   - Farm tạo Product → Retailer tạo Order → Farm confirm → Shipment được tạo → Driver được gán → Driver giao hàng → Retailer xác nhận ✅

2. **Season → Process → QR Code → Traceability**
   - Farm tạo Season → Thêm Process → Tạo QR Code → Guest/Retailer quét QR → Xem traceability ✅

3. **Subscription → Payment → Farm Services**
   - Farm mua Subscription → Thanh toán qua VNPay → Kích hoạt services ✅

4. **Notification Flow**
   - Order created → Farm nhận notification ✅
   - Shipment assigned → Driver nhận notification ✅
   - Delivery completed → Retailer nhận notification ✅

### ⚠️ Logic cần cải thiện:

1. **Retailer xem Shipment**: Chưa có route riêng, cần thêm `GET /shipments/my-orders` cho Retailer
2. **Monitoring → Notification**: Chưa có tự động gửi notification khi có thay đổi nhiệt độ/độ ẩm/pH
3. **Guest Notifications**: Chưa có hệ thống thông báo công khai

---

## 📝 KHUYẾN NGHỊ

### Ưu tiên cao:
1. Thêm route cho Retailer xem shipment của đơn hàng mình
2. Thêm endpoint cập nhật thông tin cá nhân cho Farm và Retailer
3. Tạo model RetailerProfile để lưu thông tin business license

### Ưu tiên trung bình:
4. Tích hợp notification tự động từ monitoring data
5. Tạo hệ thống thông báo công khai cho Guest

### Ưu tiên thấp:
6. Thêm endpoint xem danh sách Retailer đã ký hợp đồng (có thể dùng Order data)
