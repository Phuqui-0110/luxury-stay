# Danh sách lỗi đã sửa

## Lỗi nghiêm trọng
1. **api/config.php**: khai báo `DB_SERVER` (kiểu SQL Server) nhưng code lại dùng `DB_HOST` + `mysqli` (MySQL) → PHP báo lỗi hằng số không tồn tại, không kết nối được DB. Đã đổi về cấu hình MySQL (`localhost`, `root`).
2. **Đăng xuất / chuyển hướng trong trang admin**: dùng đường dẫn tương đối `login.html` nên từ `admin/` bị lỗi 404. Đã dùng đường dẫn gốc (ROOT).
3. **Đăng ký tài khoản không lưu**: tài khoản mới chỉ nằm trong biến JS, tải lại trang là mất, không đăng nhập được. Đã lưu vào localStorage (kèm số điện thoại).
4. **Trang admin chỉ là bản mẫu**: Phòng / Danh mục / Tài khoản chỉ hiện `alert()`. Đã làm chức năng thêm – sửa – xóa thật (dùng hộp thoại nhập liệu).
5. **Chi tiết đơn ở admin/bookings**: hiện chữ `\n` thô và vỡ khi tên khách có dấu `'`. Đã thay bằng hộp thoại chi tiết.

## Lỗi logic
6. Đặt phòng không kiểm tra **trùng lịch** (một phòng đặt được nhiều lần cùng ngày) → đã kiểm tra khi thêm giỏ và khi xác nhận đặt.
7. Không chặn đặt phòng **đang dùng / bảo trì** và ngày nhận phòng ở quá khứ.
8. Ngày "hôm nay" tính theo giờ UTC (lệch 1 ngày trước 7h sáng ở Việt Nam) → dùng giờ địa phương.
9. Thanh toán MoMo/VNPay/NH bị tự đánh dấu "đã thanh toán" ngay khi đặt → nay luôn "chưa thanh toán", nhân viên xác nhận sau.
10. **Doanh thu** ở dashboard tính cả đơn chưa thanh toán → chỉ tính đơn đã thanh toán và chưa hủy.
11. Dashboard luôn hiện "6 phòng" (gõ cứng) → lấy số thật.
12. Trang "Đơn của tôi" hiển thị đơn của **tất cả** khách khi đăng nhập bằng nhân viên/admin → chỉ hiện đơn của chính mình.
13. Mở `room-detail.html?id=999` (phòng không tồn tại) lại hiện phòng số 1 → nay báo không tìm thấy.
14. Dữ liệu phòng trong JS (6 phòng) không khớp SQL (8 phòng) → đã đồng bộ 8 phòng.
15. Form tìm phòng ở trang chủ có chọn ngày nhưng **không dùng** → nay lọc theo phòng còn trống và truyền ngày sang trang chi tiết.
16. Ngày trả phòng có thể nhỏ hơn ngày nhận sau khi đổi ngày nhận → tự xóa/giới hạn.
17. Mã đơn có thể trùng → kiểm tra trùng.
18. Không kiểm tra số điện thoại, email, mật khẩu (tối thiểu 6 ký tự) khi đăng ký / đặt phòng.
19. Người dùng bị xóa hoặc đổi quyền vẫn giữ phiên cũ → kiểm tra lại quyền mỗi lần vào trang.
20. Nhân viên vẫn thấy mục "Quản lý tài khoản" trong menu (dù bị chặn) → đã ẩn.

## Bảo mật
21. **XSS**: tên người dùng, tên khách, ghi chú, tên phòng được chèn thẳng vào HTML → đã escape toàn bộ.
22. **auth.php**: thêm `session_regenerate_id` khi đăng nhập, kiểm tra phương thức POST, kiểm tra email/mật khẩu, bắt lỗi trùng email đúng mã (1062), xóa cookie phiên khi đăng xuất.

## SQL
23. Import lại bị lỗi "table already exists" → thêm `DROP TABLE IF EXISTS`.
24. Hai tài khoản mẫu trùng số điện thoại → đã đổi; thêm chỉ mục tìm phòng theo ngày; phòng Suite 501 mẫu đặt là "trống" để demo đặt được.

## Khác
25. Ảnh phòng lỗi link → hiện ảnh thay thế; khung "Tài khoản demo" ở trang đăng nhập đang để trống → đã điền; thêm `uploads/.gitkeep` để GitHub giữ thư mục; viết lại README (hướng dẫn chạy XAMPP).
