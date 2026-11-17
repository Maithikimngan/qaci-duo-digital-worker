# Bảo mật

- Playbook và DW không bao giờ chứa token, mật khẩu, khóa, dữ liệu cá nhân hay link có kèm thông tin đăng nhập. CI
  quét các mẫu secret phổ biến và chặn trường như `token`, `password`, `api_key` trong frontmatter.
- CI chặn các cách giấu chỉ dẫn trong SKILL.md: chuỗi base64 dài, `curl ... | sh`, ký tự Unicode vô hình.
- Repo chỉ nhận file Markdown đúng layout; không nhận script, file nhị phân hay file cạnh SKILL.md.
- QACI Duo coi file import là không tin cậy: chỉ nhận phần mô tả và quy trình, không cấp quyền hay kết nối.
- Thấy secret đã lọt vào repo: **đừng** mở issue công khai. Báo riêng cho người trong `.github/CODEOWNERS`, thu hồi
  secret ngay, rồi xoá khỏi lịch sử Git.
