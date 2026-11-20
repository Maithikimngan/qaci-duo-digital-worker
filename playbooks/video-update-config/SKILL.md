---
name: video-update-config
title: Sửa biến môi trường của repo video
description: Thêm hoặc thay 1 dòng KEY=value trong .env của repo pipeline, không in giá trị ra ngoài vì có thể là secret (API key TTS/STT).
triggers: cập nhật env video, đổi api key video, update config video
tags: video, config, internal
license: Unspecified
author: QACI Duo
---

# Sửa biến môi trường của repo video

Nhận `--key <ENV_KEY>` và `--value <giá-trị>`. `<giá-trị>` thường là secret (API key TTS/STT) — **xin chủ nhập qua `request_credential` (thẻ nhập bảo mật)**, không bao giờ đọc giá trị trực tiếp từ tin nhắn chat.

Chạy: `npm run update-config -- --key <ENV_KEY> --value <giá-trị>` ở gốc repo pipeline, đọc giá trị từ file bảo mật tạm, không in ra, không nhắc lại trong tin nhắn hay log.

## Quy tắc

`ENV_KEY` chỉ chữ hoa/số/`_`, bắt đầu bằng chữ hoặc `_`. Không sửa dòng example đã comment (`# KEY=...`). Key đã có dòng `KEY=value` active thì thay đúng dòng đó; chưa có thì thêm dòng mới ở cuối. Giữ nguyên mọi dòng và comment khác trong `.env`. Không sửa `.env.example` trừ khi chủ yêu cầu rõ.

## Báo cáo

Chỉ báo: key đã thêm hay đã thay, tên key, file đích là `.env` — **không bao giờ báo giá trị**.
