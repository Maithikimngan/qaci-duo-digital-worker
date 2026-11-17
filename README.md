# QACI Duo playbooks

Thư viện **Digital Worker (DW)** và **playbook** cho QACI Duo, do cộng
đồng đóng góp bằng pull request.

- **Digital Worker** là một bot trong QACI Duo, có vai trò và quy tắc làm việc riêng.
- **Playbook** là một khả năng của DW: một quy trình cụ thể, viết trong một file `SKILL.md`.
  Một DW mang nhiều playbook; một playbook có thể gắn vào DW nào cũng được.

```
playbooks/<ten>/SKILL.md ─┐
workers/<dw>.md ──────────┴─► pull request ─► CI validate + review ─► merge main ─► publish ─► nhánh library ─► QACI Duo
```

## Đang có

| Digital Worker | Playbook |
|---|---|
| **Literature Scout** — khảo sát tài liệu và kiểm chứng ý tưởng | `survey-a-field`, `learn-domain-knowledge`, `validate-idea` |
| **Experiment Engineer** — hiện thực ý tưởng, chạy thí nghiệm và kiểm chứng | `idea-to-prototype`, `run-experiments`, `verify-agent-code` |
| **Paper Writer** — hình, viết bài và phản biện | `generate-figures`, `paper-writing-pipeline` |
| **PhD Application Advisor** — tìm giáo sư hướng dẫn và hoàn thiện hồ sơ | `find-supervisors`, `mentor-outreach`, `application-review` |

## Dùng trong QACI Duo

- **Cài cả một DW:** **+ → Templates → Community templates** → chọn DW → **Load** → **Add**. QACI Duo tạo một bot
  với đủ playbook của DW đó.
- **Thêm một playbook vào DW đang có:** mở file `SKILL.md` của playbook trên nhánh
  [`library`](https://github.com/vanhaito/qaci-duo-playbooks/tree/library) (bấm **Raw**), copy toàn bộ, dán vào
  **Settings → Skills library → Import a skill**, rồi gán cho DW muốn dùng.
- **Thử một DW trước khi merge:** **+ → Templates → Import**, dán link GitHub của file gói DW
  (xem [CONTRIBUTING.md](CONTRIBUTING.md#thử-trước-khi-mở-pull-request)).

## Đóng góp

Thêm playbook mới, cải thiện playbook có sẵn hay đề xuất DW mới: đọc [CONTRIBUTING.md](CONTRIBUTING.md). Định dạng
file ở [FORMAT.md](FORMAT.md). Chưa muốn tự viết? Mở issue **Đề xuất playbook**.

Nhánh `main` là nguồn; nhánh `library` do workflow sinh ra, đừng sửa tay. QACI Duo chỉ đọc nhánh `library`, nên
playbook chỉ tới người dùng sau khi được review và merge.

MIT License. Phần kiểm tra định dạng dựa trên [openmausbot-teams](https://github.com/milind-soni/openmausbot-teams).
