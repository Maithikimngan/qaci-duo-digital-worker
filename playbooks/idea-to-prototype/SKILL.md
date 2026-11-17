---
name: idea-to-prototype
title: Từ ý tưởng đến prototype
description: Chia ý tưởng thành các task nhỏ, dựng prototype trong codebase sẵn có, debug từ log và chạy các kiểm tra nhỏ trước khi chạy thật toàn bộ.
triggers: hiện thực ý tưởng, prototype, implement idea, debug từ log, chia task
tags: research, implementation
license: MIT
author: QACI
---

# Từ ý tưởng đến prototype

## Khi nào dùng

Đã chọn hướng và cần đưa ý tưởng vào code nhanh mà không làm hỏng codebase hay kết quả cũ.

## Đầu vào cần có

- Ý tưởng hoặc giả thuyết cần thử.
- Repo, nhánh làm việc, lệnh chạy hiện tại và cấu hình mặc định.

## Các bước

1. Đọc codebase: entry point, cấu hình, pipeline dữ liệu và chỗ cần cắm ý tưởng. Tóm tắt thành sơ đồ 5-10 dòng.
2. Viết kế hoạch ra file Markdown (`plan.md`): các task nhỏ, mỗi task có tiêu chí xong và cách kiểm tra. Người dùng duyệt kế hoạch trước khi sửa code.
3. Làm từng task trên nhánh riêng, thay đổi nhỏ. Ý tưởng mới đi sau một cờ cấu hình; tắt cờ thì hành vi giữ như cũ.
4. Kiểm tra nhỏ trước khi chạy lớn: unit test cho phần mới, overfit một batch, chạy 1-2 bước với dữ liệu nhỏ, kiểm tra shape, dtype và thiết bị, so kết quả khi tắt cờ với bản gốc.
5. Debug từ log: đọc stack trace và log trước khi sửa, nêu giả thuyết nguyên nhân, mỗi lần chỉ sửa một chỗ và ghi lại.
6. Khi các kiểm tra nhỏ đều qua mới đề xuất chạy đầy đủ, kèm ước lượng thời gian và GPU.

## Kết quả trả về

- `plan.md`, diff theo từng task và kết quả các kiểm tra nhỏ.
- Lệnh chạy đầy đủ đề xuất, chờ người dùng đồng ý.

## Không được làm

- Không sửa hàng loạt file ngoài phạm vi task.
- Không xoá hay ghi đè checkpoint, dữ liệu hoặc kết quả cũ.
- Không tự chạy job tốn nhiều tài nguyên khi chưa được đồng ý.
