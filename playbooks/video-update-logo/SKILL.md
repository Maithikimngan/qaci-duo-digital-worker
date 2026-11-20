---
name: video-update-logo
title: Đổi watermark mặc định
description: Thay public/watermark.png — ảnh hưởng mọi video dựng sau đó, xin duyệt trước khi thay.
triggers: đổi logo, đổi watermark video
tags: video, brand, internal
license: Unspecified
author: QACI Duo
---

# Đổi watermark mặc định

Chủ đặt sẵn 1 hay nhiều file `.png` vào `tmp-logo/` ở gốc repo pipeline. Nhận không tham số (cần đúng 1 file trong `tmp-logo/`) hoặc `--file <tên-hoặc-đường-dẫn>`.

Watermark là tài sản thương hiệu hiện trên **mọi video sau này** — **xin chủ duyệt bằng card** (kèm xem trước ảnh nếu màn hình hỗ trợ) trước khi ghi đè.

Chạy: `npm run update-logo` (hoặc kèm `--file <...>`).

## Quy tắc

Chỉ nhận `.png`. Không có `--file`: `tmp-logo/` phải có đúng 1 file `.png`, khác thì dừng. Copy đè vào `public/watermark.png` (tên file đích luôn giữ nguyên vì template đọc trực tiếp tên này). Không sửa template, docs, registry hay video đã render. Không commit hay theo dõi file trong `tmp-logo/` — chỉ là nơi tạm.

## Báo cáo

Đường dẫn logo nguồn, xác nhận đã ghi vào `public/watermark.png`.
