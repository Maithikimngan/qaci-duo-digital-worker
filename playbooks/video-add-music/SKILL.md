---
name: video-add-music
title: Thêm nhạc nền vào thư viện asset
description: Copy 1 file mp3 từ tmp-music/ vào public/assets/<category>/music/ và đăng ký trong manifest.json, không đổi default của template nào.
triggers: thêm nhạc nền, add music video
tags: video, assets, internal
license: Unspecified
author: QACI Duo
---

# Thêm nhạc nền vào thư viện asset

Chủ đặt sẵn 1 hay nhiều file `.mp3` vào `tmp-music/` ở gốc repo pipeline trước khi chạy. Nhận `--category <tên>`, tuỳ chọn `--file <tên-file-hoặc-đường-dẫn>`.

Chạy: `npm run add-music -- --category <tên>` (hoặc kèm `--file ...`).

## Quy tắc

1. `<tên>` phải khớp thư mục `public/assets/<tên>/`; thiếu `manifest.json` ở đó thì dừng.
2. Có `--file`: nhận đường dẫn trực tiếp (từ gốc repo hoặc tuyệt đối) hoặc tên file trong `tmp-music/`.
3. Không có `--file`: đọc `tmp-music/`, dừng nếu không phải đúng 1 file `.mp3`.
4. Copy vào `public/assets/<tên>/music/<tên-file-gốc>.mp3`; trùng tên đích thì dừng.
5. Thêm 1 entry vào `music[]` của manifest: `id` = tên file viết thường, ký tự không phải chữ/số thành `-`; `path` = `assets/<tên>/music/<tên-file-gốc>.mp3`; `volume: 0.1`; `desc: "Background music"`; `mood: ["general"]`.
6. `id` hay `path` đã có trong manifest thì dừng.

Không tự nghĩ ra category mới, không tự đổi tên file trùng, không sửa `src/templates/registry.ts` (việc đó là `video-update-bg-music`).

## Báo cáo

Category, `id` vừa tạo, `path` trong manifest, file đã copy, đường dẫn manifest.
