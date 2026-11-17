# Bảo mật

- Playbook không bao giờ chứa token, mật khẩu, khóa, dữ liệu khách hàng hay link có kèm thông tin đăng nhập.
  CI quét các mẫu secret phổ biến và chặn trường như `token`, `password`, `apiKey` trong phần YAML.
- Lịch chạy luôn tắt khi cài; QACI Duo cũng tự tắt và bỏ các trường không biết khi import.
- Thấy secret đã lọt vào repo: **đừng** mở issue công khai. Báo riêng cho người phụ trách trong
  `.github/CODEOWNERS`, thu hồi secret đó ngay, rồi xoá khỏi lịch sử Git.
