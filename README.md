# Luxury Stay - Hệ thống Quản lý Khách sạn

Website đặt phòng khách sạn gồm **giao diện khách hàng**, **trang quản trị (Admin / Nhân viên)** và **backend PHP + MySQL**.

## Cấu trúc

### Frontend (HTML, CSS, JS)
| Trang | Chức năng |
|-------|-----------|
| index.html | Trang chủ + Tìm phòng (theo ngày, số khách, loại phòng) |
| login.html | Đăng nhập / Đăng ký |
| rooms.html | Danh sách phòng (cần đăng nhập) |
| room-detail.html | Chi tiết phòng + Thêm vào giỏ |
| cart.html | Giỏ đặt phòng (xem, xóa) |
| checkout.html | Đặt phòng + chọn thanh toán (tiền mặt, NH, MoMo, VNPay) |
| orders.html | Xem đơn của mình / Hủy đơn đang chờ xác nhận |

### Trang quản trị (`admin/`)
| Trang | Chức năng |
|-------|-----------|
| dashboard.html | Thống kê (tổng phòng, đơn chờ, doanh thu, tổng đơn) |
| bookings.html | Quản lý đơn (cập nhật trạng thái, thanh toán, xem chi tiết) |
| rooms.html | Quản lý phòng (thêm / sửa / xóa / đổi trạng thái) |
| categories.html | Quản lý danh mục phòng (thêm / sửa / xóa) |
| users.html | Quản lý tài khoản (chỉ Admin: thêm / sửa / xóa) |

### Backend (PHP + MySQL)
| File | Chức năng |
|------|-----------|
| sql/database.sql | Schema + dữ liệu mẫu (có thể import lại nhiều lần) |
| api/config.php | Kết nối MySQL + session |
| api/auth.php | API đăng nhập / đăng ký / đăng xuất / me |

## Tài khoản demo (mật khẩu: `password`)
- **Admin:** admin@luxurystay.vn
- **Nhân viên:** staff@luxurystay.vn
- **Khách hàng:** user@email.com

## Cách chạy

### Chạy demo giao diện (không cần cài gì)
Mở `index.html` hoặc `login.html` bằng trình duyệt. Dữ liệu demo (phòng, tài khoản, đơn đặt) được lưu trong **localStorage** của trình duyệt.
Muốn đưa dữ liệu về mặc định: mở DevTools (F12) → Application → Local Storage → Clear.

### Chạy phần PHP + MySQL
1. Cài XAMPP hoặc Laragon, bật Apache và MySQL.
2. Import `sql/database.sql` vào MySQL (phpMyAdmin → Import). Lưu ý: file sẽ xóa và tạo lại các bảng.
3. Mở `api/config.php`, chỉnh `DB_HOST`, `DB_USER`, `DB_PASS` nếu máy bạn khác mặc định (XAMPP: `root` / mật khẩu rỗng).
4. Đặt thư mục `hotel-system` vào `htdocs` (XAMPP) hoặc `www` (Laragon) rồi mở `http://localhost/hotel-system/`.
5. Thử API: `http://localhost/hotel-system/api/auth.php?action=me`

## Lưu ý
- Giao diện hiện dùng localStorage để demo đầy đủ chức năng; phần PHP hiện cung cấp API xác thực (auth). Khi triển khai thật cần nối các trang với API.
- Mật khẩu ở chế độ demo (localStorage) chỉ để minh họa, không dùng cho hệ thống thật. Phần PHP đã mã hóa mật khẩu bằng `password_hash`.
