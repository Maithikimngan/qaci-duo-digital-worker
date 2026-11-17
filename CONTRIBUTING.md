# Đóng góp playbook và Digital Worker

## Bạn muốn làm gì?

| Việc | File bạn sửa |
|---|---|
| Thêm một khả năng mới | Tạo `playbooks/<ten-playbook>/SKILL.md` (copy từ `templates/playbook/SKILL.md`). Muốn DW nào dùng thì thêm tên playbook vào `playbooks:` của `workers/<dw>.md`. |
| Cải thiện playbook có sẵn | Sửa `playbooks/<ten>/SKILL.md`. |
| Tạo Digital Worker mới | Tạo `workers/<ten-dw>.md` (copy từ `templates/worker.md`) và liệt kê các playbook nó mang. |

Một playbook là **một quy trình làm được việc cụ thể**, không phải một vai trò. "Viết rebuttal" là playbook; "người
viết paper" là DW.

## Các bước

1. Fork repo, tạo nhánh mới.
2. Viết file theo [FORMAT.md](FORMAT.md). Tên thư mục playbook và `name:` phải giống nhau; tên file DW và `id:` phải
   giống nhau.
3. Chạy kiểm tra ở máy (Node 20 trở lên):

   ```sh
   npm ci --ignore-scripts
   npm test
   ```

4. Mở pull request vào `main` và điền checklist.

## Thử trước khi mở pull request

- **Một playbook:** copy toàn bộ `SKILL.md`, dán vào **Settings → Skills → Import a skill** trong QACI Duo (cần bật
  **Advanced mode**), bật skill, **Assign** cho một DW và giao cho nó một việc thật.
- **Cả một DW:** chạy `npm run build`, đẩy nhánh lên fork, rồi trong QACI Duo vào **+ → Templates → Import** và dán link
  GitHub của `dist/packages/<dw>.md`. Hoặc dán link sau khi đã đẩy file đó lên một nhánh của fork.

## Quy trình review

| Bước | Ai | Điều gì xảy ra |
|---|---|---|
| Mở pull request | Người đóng góp | CI `validate` chạy: định dạng, layout repo, quét secret, gói DW sinh ra phải hợp lệ |
| Review | Code owner (`.github/CODEOWNERS`) | Đọc nội dung: quy trình có đúng, có an toàn, có giới hạn việc cần người duyệt không |
| Merge vào `main` | Code owner | Chỉ merge được khi CI xanh và có approve |
| Publish | Workflow `Publish library` | Sinh lại nhánh `library` trong khoảng một phút |
| Có trên QACI Duo | Người dùng | Thấy thay đổi sau tối đa ~5 phút (GitHub cache file raw) |

## Viết playbook tốt

- Mỗi bước đủ cụ thể để người khác làm lại được và có cách kiểm tra.
- Nói rõ đầu vào phải hỏi trước, và kết quả trả về ở dạng nào.
- Có mục **Không được làm**: việc nào DW không tự làm khi chưa có người duyệt (gửi email, nộp bài, xoá dữ liệu,
  chạy job tốn tài nguyên).
- Yêu cầu dẫn nguồn và tách điều đã kiểm khỏi suy đoán; không để DW bịa paper hay số liệu.
- Không đưa tên người, tên dự án nội bộ hay dữ liệu thật vào ví dụ.
