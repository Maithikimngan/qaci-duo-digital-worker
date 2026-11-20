---
name: video-update-bg-music
title: Đổi nhạc nền mặc định của 1 template
description: Cập nhật defaultBgMusic của một template trong registry.ts, tìm file nhạc theo manifest asset đã đăng ký.
triggers: đổi nhạc nền template, update bg music
tags: video, templates, internal
license: Unspecified
author: QACI Duo
---

# Đổi nhạc nền mặc định của 1 template

Nhận `--template <id-hoặc-tên>` và `--music <file-hoặc-đường-dẫn>`. Chạy: `npm run update-bg-music -- --template <...> --music <...>` ở gốc repo pipeline.

## Cách khớp

- Template: ID đầy đủ (`news/current-affairs-dark`) hoặc đoạn cuối duy nhất (`current-affairs-dark`). Tên mơ hồ (khớp nhiều template) thì dừng, hỏi chủ ID đầy đủ.
- Nhạc: khớp `music[].path` đúng trong manifest, hoặc tên file, hoặc `music[].id`. Tìm trước ở `assetManifestPath` của template đã chọn, rồi mới tới các `public/assets/**/manifest.json` khác.

Không tìm thấy nhạc: dừng, báo không khớp asset nào — không tự bịa đường dẫn, không sửa `registry.ts`.

Lệnh này **không chạy `video-gen`**, không render video nào.

## Báo cáo

ID template đã khớp, `defaultBgMusic` mới, manifest đã tìm thấy track.
