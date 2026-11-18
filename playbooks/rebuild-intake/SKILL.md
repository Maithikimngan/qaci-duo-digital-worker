---
name: rebuild-intake
title: Nhận việc và xác minh quyền
description: Analyst nhận việc dựng lại app, xác minh quyền phân tích bằng card, chọn clean room hay Deep, ghi INTAKE.md. Dùng đầu tiên cho mọi việc mới.
triggers: rebuild intake, nhận việc và xác minh quyền
tags: adlc-craft, internal
license: Unspecified
author: QACI Duo
---

# Nhận việc và xác minh quyền

Bước này chạy **trước mọi lệnh chạm vào bản gốc**. Chưa xong bước này thì không mở URL, thư mục hay file nào của bản gốc.

## 1. Hiểu yêu cầu

Từ tin của chủ, ghi lại:
- **Bản gốc**: URL, đường dẫn thư mục/file, hay repo. Loại: website, web app, app desktop, mobile, CLI, file/định dạng.
- **Bản mới chủ muốn**: dựng lại giống hành vi, hay chỉ lấy một phần; ngôn ngữ/stack mong muốn (không nói thì chọn stack đơn giản nhất chạy được, ghi lý do); repo bản mới đặt ở đâu (mục Môi trường `REBUILD_REPOS`, hoặc chủ chỉ định).
- **Ngân sách**: thời gian, số vòng sửa (mặc định 3).
Thiếu bản gốc hoặc nơi đặt bản mới thì hỏi chủ một câu, không đoán.

## 2. Từ chối ngay khi

- Yêu cầu vượt đăng nhập, paywall, DRM, anti-cheat, giới hạn tần suất hay bất kỳ biện pháp kỹ thuật nào.
- Yêu cầu dùng tài khoản không phải của chủ, hoặc lấy dữ liệu cá nhân của người khác.
- Yêu cầu sao chép nguyên văn nội dung, logo, thương hiệu để giả mạo bản gốc.
Trả lời chủ một đoạn ngắn: không làm phần nào, vì sao, và phần nào làm được nếu có. Ghi vào `LOG.md`.

## 3. Card xác minh quyền (luôn hỏi)

Gửi bằng công cụ hỏi người dùng, một câu hỏi:
- Tiêu đề: "Quyền phân tích bản gốc".
- Nội dung: bản gốc là gì, sẽ làm gì với nó (chụp màn hình và thao tác từ bên ngoài; Deep thì đọc cả code bên trong), dữ liệu không rời máy trừ phần gửi cho model. Bản gốc là website thì nói thêm: sẽ mở trang trong một trình duyệt riêng, không đăng nhập, nên script của trang sẽ chạy trên máy; chọn một trong các lựa chọn có quyền nghĩa là đồng ý việc này.
- Lựa chọn: "Tôi sở hữu bản gốc", "Mã nguồn mở (ghi giấy phép ở ô trả lời)", "Có văn bản cho phép (ghi ở ô trả lời)", "Không chắc / không có quyền".
"Không chắc" hoặc "không có quyền" thì dừng việc như mục 2.

## 4. Chọn chế độ

- **Clean room (mặc định)**: chỉ quan sát từ bên ngoài, không đọc code hay file bên trong bản gốc.
- **Deep**: đọc code và file bên trong. Chỉ đề xuất khi clean room không đủ để mô tả hành vi (vd file định dạng lạ, CLI không có tài liệu). **Luôn card** "Bật Deep mode", nói rõ sẽ đọc gì. Kể cả khi Deep, Engineer và Checker vẫn ở clean room.

## 5. Ghi `INTAKE.md`

Tạo `sharedBotFolder/rebuild/<slug>/` (slug ngắn từ tên việc) gồm `study/`, `spec/`, `parity/`, `LOG.md`, và `INTAKE.md`:

```
# Intake: <tên việc>
- Bản gốc: <URL/đường dẫn> (loại: …)
- Cơ sở quyền: <lựa chọn trên card, nguyên văn câu trả lời, giờ>
- Tài sản được phép dùng lại: <không / danh sách chủ xác nhận>
- Chế độ: clean room | Deep (card lúc <giờ>)
- Bản mới: stack <…>, repo <đường dẫn>
- Ngân sách: <thời gian>, tối đa <n> vòng sửa
```

Rồi chuyển sang skill `rebuild-study`.
