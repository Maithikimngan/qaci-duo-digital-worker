# Định dạng

## Playbook: `playbooks/<ten-playbook>/SKILL.md`

Một file [SKILL.md](https://agentskills.io) tiêu chuẩn với vài trường thêm. QACI Duo đọc mỗi trường của frontmatter
trên **một dòng**, nên không dùng danh sách YAML hay giá trị nhiều dòng; danh sách thì cách nhau bằng dấu phẩy. Giá
trị có chuỗi `": "` thì đặt trong nháy kép.

| Trường | Bắt buộc | Ý nghĩa |
|---|---|---|
| `name` | có | Trùng tên thư mục; chữ thường, số, gạch ngang, tối đa 64 ký tự |
| `title` | có | Tên hiển thị trong QACI Duo, tối đa 100 ký tự |
| `description` | có | Một câu: playbook làm được gì, kết quả là gì. Tối đa 300 ký tự |
| `triggers` | có | 1-30 cụm từ người dùng hay nói khi cần playbook này, cách nhau bằng dấu phẩy |
| `tags` | không | Tối đa 8 từ chữ thường, cách nhau bằng dấu phẩy |
| `license` | có | Ví dụ `MIT` |
| `author` | có | Tên người hoặc nhóm viết |
| `compatibility` | không | Ghi chú môi trường cần có |

Phần thân là quy trình, tối đa 24.000 ký tự. Nên có các mục: **Khi nào dùng**, **Đầu vào cần có**, **Các bước**,
**Kết quả trả về**, **Không được làm**.

CI chặn: trường lạ, chuỗi giống base64 dài, lệnh `curl ... | sh`, ký tự Unicode vô hình và mọi chuỗi trông như secret.

## Digital Worker: `workers/<ten-dw>.md`

YAML frontmatter rồi đến phần thân Markdown.

| Trường | Bắt buộc | Ý nghĩa |
|---|---|---|
| `id` | có | Trùng tên file |
| `release` | có | Phiên bản dạng `1.0.0`; tăng khi thay đổi |
| `name`, `title` | có | Tên DW và vai trò |
| `tagline` | có | Một câu, tối đa 160 ký tự; hiện trên thẻ trong Templates |
| `description` | có | DW làm gì và không làm gì, tối đa 2.000 ký tự. Đây là mô tả của bot trong QACI Duo |
| `category`, `license`, `author.name` | có | |
| `color` | có | `green`, `blue`, `red`, `orange`, `purple`, `cyan`, `pink`, `yellow`, `teal`, `coral` |
| `outcomes` | có | 1-12 kết quả người dùng nhận được |
| `playbooks` | có | 1-30 tên thư mục trong `playbooks/` |
| `apps` | không | Ứng dụng cần kết nối: `slug`, `label`, `reason`, `optional`. Chỉ khai báo, không kèm thông tin đăng nhập |
| `tags`, `featured`, `setupMinutes` | không | `featured: true` đưa DW lên đầu danh sách |

Phần thân cần ba mục: `## Mission`, `## Working rules`, `## Completion rule`.

## Nhánh `library` (sinh tự động)

Sau mỗi lần merge, workflow sinh từ mỗi DW một gói BotMRR Markdown v1 (`packages/<dw>.md`): một agent, các playbook
thành skill của bot, không có room hay lịch chạy. Kèm theo là `catalog.json` mà QACI Duo đọc, và bản sao của mọi
`playbooks/<ten>/SKILL.md` để import riêng.
