## Playbook

<!-- Tên team DW và kết quả nó giúp người dùng đạt được. -->

## Kiểm tra

- [ ] Chỉ thêm hoặc sửa file trong `packages/` (một file `.md` cho mỗi team)
- [ ] `id` trong file trùng tên file
- [ ] `npm test` chạy xanh (hoặc CI của PR này xanh)
- [ ] Đã thử import file này trong QACI Duo (Thêm team → dán link GitHub của file)

## An toàn

- [ ] Không có token, mật khẩu, dữ liệu khách hàng, file nhị phân hay script
- [ ] Mọi lịch chạy có `enabledAfterInstall: false`
- [ ] Merge, deploy, gửi ra ngoài vẫn chờ người dùng duyệt
- [ ] Kết nối ứng dụng chỉ được khai báo, không kèm thông tin đăng nhập

## Đã thử với việc gì

<!-- Một yêu cầu thực tế bạn đã giao cho team này và kết quả. -->
