---
name: video-ai-help
title: Liệt kê lệnh video hỗ trợ
description: Trả bảng tất cả lệnh pipeline video, cách dùng và mô tả ngắn, chỉ đọc tài liệu không chạy gì.
triggers: lệnh video nào, video help, ai-help video
tags: video, help, internal
license: Unspecified
author: QACI Duo
---

# Liệt kê lệnh video hỗ trợ

Đọc `AGENTS.md` và các `docs/SKILL-*.md` của repo pipeline khi cần. **Không chạy** bất kỳ lệnh setup, tạo video, render hay sửa asset nào — chỉ đọc và liệt kê.

## Định dạng trả lời

Bảng Markdown đúng 3 cột:

| command | usage | description |
|---|---|---|

Liệt kê đủ: `video-gen` (gốc `/gen-video`), `video-templates`, `video-add-music` (nhắc đặt mp3 vào `tmp-music/`), `video-update-bg-music`, `video-update-template-voice`, `video-sync-templates` (nhắc đặt gói vào `load-templates/`), `video-update-logo` (nhắc đặt png vào `tmp-logo/`), `video-update-config`, `video-update-version`, `video-review-publish`. Mô tả ngắn gọn, thực dụng.

Sau bảng, thêm đúng 1 dòng: "Chi tiết từng việc đều có hướng dẫn trong skill tương ứng."

## Ràng buộc

Không sửa file nào. Không chạy bất kỳ skill nào khác. Không liệt kê lệnh chưa có thật hay đã bỏ (comment).
