---
name: video-templates
title: Liệt kê template video có sẵn
description: Đọc registry template của repo và trả bảng lệnh/mô tả theo từng category, không chạy pipeline hay sửa file.
triggers: liệt kê template, xem template video, có template nào
tags: video, templates, internal
license: Unspecified
author: QACI Duo
---

# Liệt kê template video có sẵn

Đọc `TEMPLATE_REGISTRY` trong `src/templates/registry.ts` của repo pipeline (`VIDEO_REPO_PATH`) tại đúng thời điểm chạy — đây là nguồn duy nhất, không dùng danh sách nhớ từ lần trước.

## Cách trả lời

Gom theo `category`, giữ đúng thứ tự category xuất hiện lần đầu trong registry. Mỗi category: tiêu đề dễ đọc (`creative` → "Creative", `news` → "News"), rồi một bảng 2 cột:

| command | description |
|---|---|
| `/gen-video --template <id> <nội dung>` | mô tả ngắn tiếng Việt |

Với mỗi entry: giữ nguyên thứ tự trong registry, dùng đúng `id` để tạo command, viết mô tả ngắn dựa trên `name`/`description`/`behavior` và biến thể trong ID (dark/light, có SFX hay silent, fixed/hybrid/creative). Template `demo-scroll` nhắc cần URL demo công khai; `article-video-demo` nhắc cần URL bài viết có video dùng được (không có thì pipeline dừng); `source-led` nhắc cần URL công khai, lấy ảnh/video làm dẫn chứng kèm ghi nguồn, fallback free-style theo cảnh nếu thiếu media.

Không chạy `video-gen`, không sửa file, không đọc toàn bộ tài liệu từng template chỉ để liệt kê.

## Lỗi

Không đọc được registry: báo đường dẫn file, dừng. Registry rỗng: báo chưa có template nào. Entry thiếu `id`: bỏ qua, cảnh báo ngắn sau bảng.
