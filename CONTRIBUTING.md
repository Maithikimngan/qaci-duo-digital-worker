# Đóng góp playbook

Cảm ơn bạn dạy Digital Worker một việc mới. Bạn chỉ cần sửa **một file** trong `packages/`.

## Các bước

1. **Fork** repo này (hoặc tạo nhánh nếu bạn có quyền ghi).
2. Copy [`templates/playbook.md`](templates/playbook.md) thành `packages/<ten-playbook>.md`.
   Tên file chỉ gồm chữ thường, số và dấu `-`, ví dụ `bug-triage-desk.md`.
3. Sửa file:
   - `id:` trùng tên file (không có `.md`).
   - Mỗi DW có `key`, `name`, `title`, `description` và `appearance.color`.
   - Mỗi quy trình trong `playbooks:` có `triggers` và `instructions` cụ thể.
   - Lịch chạy (`routines:`) luôn có `enabledAfterInstall: false`.
   - Phần thân giữ đủ 7 mục: `## Activation`, `## Mission`, `## Outcomes`, `## Connections`, `## Team`,
     `## Chief of Staff`, `## Completion rule`.
4. Kiểm tra (không bắt buộc, CI sẽ chạy lại):
   ```sh
   npm ci
   npm test
   ```
5. Thử trong QACI Duo: đẩy nhánh lên fork, rồi dán link GitHub của file vào ô import GitHub của QACI Duo.
6. Mở **Pull Request** vào `main` và điền checklist.

Không biết Git? Bạn có thể tạo file ngay trên GitHub: vào thư mục `packages/` → *Add file → Create new file*,
dán nội dung từ file mẫu, rồi chọn *Propose changes*. GitHub sẽ tự tạo fork và Pull Request.

## Điều gì xảy ra sau khi mở PR

| Bước | Ai | Kết quả |
|---|---|---|
| CI `Validate playbooks` | Máy, vài giây | Kiểm tra định dạng, 7 mục bắt buộc, lịch chạy tắt sẵn, quét secret, chỉ cho phép file trong layout đã biết |
| Review | Người phụ trách trong `.github/CODEOWNERS` | Duyệt nội dung: vai trò rõ, quy trình đúng, không vượt quyền người dùng |
| Merge vào `main` | Người phụ trách | Workflow `Publish library` cập nhật nhánh `library` trong khoảng một phút |
| Dùng | Chủ của DW | QACI Duo thấy team trong Thư viện; cài ở trạng thái tắt, chủ tự bật |

## Quy tắc review

- Một PR một team. Sửa team có sẵn thì tăng `release` (ví dụ `1.0.0` → `1.1.0`).
- Không tự duyệt PR của chính mình.
- Từ chối khi playbook: xin token hay mật khẩu trong chat, tự merge/deploy/gửi ra ngoài không qua người duyệt,
  chứa dữ liệu khách hàng hay thông tin nội bộ nhạy cảm, hoặc thêm script/file nhị phân.
