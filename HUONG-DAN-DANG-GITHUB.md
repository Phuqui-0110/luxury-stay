# Hướng dẫn đăng lên GitHub Pages (5 phút)

Thư mục này đã được chuẩn bị sẵn: `index.html` nằm ngay ở gốc nên chỉ cần kéo thả là chạy.

1. Đăng nhập github.com → **New repository**.
2. Đặt tên repo: dùng đúng dạng **`TÊN-GITHUB-CỦA-BẠN.github.io`** để link ngắn gọn
   (ví dụ tài khoản là `nguyenvana` thì repo là `nguyenvana.github.io`).
   Chọn **Public** → **Create repository**.
3. Bấm **uploading an existing file** → kéo thả **toàn bộ file và thư mục trong thư mục này**
   (index.html, css, js, admin, api, sql, ...) → **Commit changes**.
   (Nếu GitHub không cho kéo cả thư mục, hãy kéo từng thư mục con, hoặc dùng GitHub Desktop.)
4. Vào **Settings → Pages** → Branch chọn `main`, thư mục `/ (root)` → **Save**.
5. Chờ 1–3 phút, link của bạn là: `https://TÊN-GITHUB-CỦA-BẠN.github.io/`
   Gửi link này cho cô. Mở là chạy, không cần cài gì.

## Để Google tìm thấy
1. Vào https://search.google.com/search-console → thêm link ở dạng **URL prefix**.
2. Xác minh bằng **HTML tag**: dán dòng `<meta name="google-site-verification" ...>` vào `<head>` của `index.html`, Commit, bấm Verify.
3. Dán link vào ô kiểm tra trên cùng → **Request indexing**.
Google thường mất vài ngày đến vài tuần mới hiển thị. Tìm bằng "Luxury Stay hotel management" sẽ dễ thấy hơn.

## Lưu ý
- Các trang cần đăng nhập (đặt phòng, giỏ, admin...) đã gắn `noindex` nên Google chỉ lập chỉ mục trang chủ, đúng ý.
- GitHub Pages chỉ chạy được giao diện (dữ liệu lưu trong trình duyệt). Thư mục `api/` và `sql/` (PHP + MySQL) chỉ chạy khi cài XAMPP/Laragon trên máy, xem README.md.
