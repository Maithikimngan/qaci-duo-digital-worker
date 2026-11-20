---
name: video-update-template-voice
title: Đổi giọng đọc TTS mặc định của 1 template
description: Cập nhật voice.geminiVoice và/hoặc voice.elevenLabsVoiceId của một template trong registry.ts, chỉ sửa cấu hình cục bộ, không gọi API nhà cung cấp.
triggers: đổi giọng đọc template, update voice video
tags: video, templates, internal
license: Unspecified
author: QACI Duo
---

# Đổi giọng đọc TTS mặc định của 1 template

Nhận `--template <id-hoặc-tên>` và ít nhất 1 trong `--gemini <tên-giọng>` / `--elevenlabs <voice-id>` (dùng cả 2 cũng được). Chạy: `npm run update-template-voice -- --template <...> [--gemini <...>] [--elevenlabs <...>]` ở gốc repo pipeline.

## Cách khớp

Template: ID đầy đủ hoặc đoạn cuối duy nhất, giống `video-update-bg-music`. Mơ hồ thì dừng, hỏi ID đầy đủ.

Chỉ cập nhật đúng field được truyền flag; truyền cả 2 thì cập nhật cả 2. Template chưa có block `voice` thì script tự tạo, đặt ngay sau `specDocPath`.

**Không gọi API nhà cung cấp để kiểm tra voice ID hợp lệ** — lệnh này chỉ sửa cấu hình cục bộ. Không chạy `video-gen`, không tạo lại `voice.mp3`, không transcribe, không render.

## Báo cáo

ID template đã khớp, giọng Gemini mới (nếu có), voice ID ElevenLabs mới (nếu có).
