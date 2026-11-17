# QACI Duo Teams

Thư viện playbook cho Digital Worker (DW) của **QACI Duo**. Mỗi playbook là **một file Markdown** trong
[`packages/`](packages/) mô tả một team DW: vai trò, quy trình, lịch chạy gợi ý và việc nào phải chờ người duyệt.

Ai cũng đóng góp được bằng một Pull Request. Sau khi PR được duyệt và merge, playbook xuất hiện trong QACI Duo.

```
Viết packages/<ten>.md ──► Mở Pull Request ──► CI kiểm tra + người phụ trách duyệt ──► Merge vào main
                                                                                         │
                         QACI Duo: Thêm team → Thư viện  ◄── nhánh `library` (tự sinh) ◄─┘
```

## Dùng một playbook trong QACI Duo

- **Từ thư viện:** QACI Duo đọc `catalog.json` ở nhánh [`library`](../../tree/library). Mở *Thêm team → Thư viện*,
  chọn team, xem trước rồi thêm.
- **Từ link:** dán link GitHub của file, ví dụ
  `https://github.com/vanhaito/qaci-duo-teams/blob/main/packages/release-readiness-desk.md`, vào ô import GitHub.

Khi cài, mọi lịch chạy ở trạng thái tắt; chủ của DW xem rồi tự bật. Playbook không mang token hay quyền truy cập:
kết nối ứng dụng (GitHub, Azure DevOps...) luôn đi qua luồng kết nối của QACI Duo.

## Đóng góp

Đọc [CONTRIBUTING.md](CONTRIBUTING.md). Tóm tắt:

1. Copy [`templates/playbook.md`](templates/playbook.md) thành `packages/<ten-playbook>.md`.
2. Sửa nội dung; `id` phải trùng tên file. Định dạng chi tiết ở [FORMAT.md](FORMAT.md).
3. Mở Pull Request. CI chạy `npm test`; người phụ trách duyệt; merge.

Chưa muốn tự viết file? Mở issue [Đề xuất playbook](../../issues/new?template=playbook-idea.yml).

## Repo này có gì

| Đường dẫn | Nội dung |
|---|---|
| `packages/*.md` | Playbook, mỗi team một file. Nơi duy nhất contributor cần sửa. |
| `templates/playbook.md` | File mẫu để copy. |
| `scripts/` | Bộ kiểm tra (`npm test`) và bộ sinh thư viện (`npm run build`). |
| `.github/workflows/validate.yml` | Chạy kiểm tra trên mọi PR. |
| `.github/workflows/publish.yml` | Sau khi merge vào `main`, sinh `catalog.json` và các file team rồi đẩy sang nhánh `library`. |

Định dạng file tương thích BotMRR Markdown v1 của
[openmausbot-teams](https://github.com/milind-soni/openmausbot-teams), nên Claude hay ChatGPT đọc phần thân và làm theo được.
