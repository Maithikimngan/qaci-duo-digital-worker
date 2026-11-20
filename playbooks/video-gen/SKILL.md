---
name: video-gen
title: Tạo video bằng pipeline 8 bước
description: Chạy pipeline Setup → Planner → Teller → Audio → Transcribe → Spec → Coder → Render để tạo một video ngắn từ nội dung chủ đưa, xin duyệt trước khi tốn tiền TTS/render.
triggers: tạo video, gen video, dựng video mới, làm video từ nội dung
tags: video, pipeline, internal
license: Unspecified
author: QACI Duo
---

# Tạo video bằng pipeline 8 bước

Việc chính của bạn. Nhận: nội dung (`<context>`), tuỳ chọn `--template <id>` (mặc định `creative/free-style`), tuỳ chọn `--audio=<mode>` (`full`/`music`/`sfx`/`voice-only`, mặc định theo template). Chạy từ gốc repo pipeline (`VIDEO_REPO_PATH` trong Môi trường của team).

## Mô hình chung

Mỗi lần tạo dùng một template đăng ký trong `src/templates/registry.ts` và ghi ra `videos/<slug>/spec.json`. Template thuộc 1 trong 3 lớp hành vi: **Fixed** (điền đúng schema, dùng component có sẵn), **Hybrid** (giữ hệ thống thiết kế, tạo scene riêng khi cần), **Creative** (tự thiết kế ngôn ngữ hình ảnh mới). Đọc đúng tài liệu template đã chọn (`specDocPath`) để biết lớp nào — đừng mặc định là Fixed.

## Hợp đồng âm thanh (`--audio`)

Giọng đọc (narration) luôn được tạo và render. `--audio` chỉ quyết định nhạc nền và SFX chuyển cảnh:

| Flag | Nhạc nền | SFX |
|---|---|---|
| `full` | có | có |
| `music` | có | không |
| `sfx` | không | có |
| `voice-only` | không | không |
| (bỏ trống) | theo mặc định của template | theo mặc định của template |

Bật nhạc thì dùng đúng `defaultBgMusic` của template trong registry; template không có default thì dùng `assets/news/music/sonican-tech-news-information.mp3`, dừng nếu file đó cũng không có. Tắt nhạc thì `video.bgMusic` là `null`. Giữ SFX gọn, không thêm âm thanh meme/lỗi/xác nhận.

## Các bước

1. **Setup**: tạo thư mục `videos/<slug>/`, ghi `context.txt`/`template.txt`/`audio.txt`. Chạy hook preflight của template nếu có (vd cần URL công khai).
2. **Planner**: ghi `plan.json`. Theo override của template nếu có, không thì theo pipeline chung.
3. **Teller**: ghi `script/script.json`.
4. **Audio (TTS)**: tạo hoặc dùng lại `voice.mp3`. **File đã có thì bắt buộc dùng lại**, không tạo lại để sửa độ dài — đổi nhịp cảnh thay vì đọc lại TTS. **Trước khi gọi TTS lần đầu cho một video mới: xin chủ duyệt bằng card** (nội dung: provider sẽ dùng — ElevenLabs/Gemini theo `.env` — và ước tính không tốn phí cố định nhưng tính theo ký tự). Việc do bot khác giao mà hệ thống không cho hỏi người thì báo `CẦN CHỦ DUYỆT: tạo giọng đọc` và dừng lượt.
5. **Transcribe (STT)**: ghi `timeline.json`.
6. **Spec**: đọc `template.txt`, `audio.txt` (thiếu hoặc sai thì dừng), `plan.json`, `script.json`, `timeline.json`; tìm `specDocPath`; áp override Spec của template; áp Hợp đồng âm thanh sau cùng (flag tường minh thắng default của template); ghi `spec.json`. Kiểm mọi scene có timing theo audio và tổng = `totalFrames`. `timeline.json` ra độ dài lệch mục tiêu short-form thì chỉnh nhịp/`defaultDuration`, không quay lại bước 4 tạo lại giọng trừ khi chủ yêu cầu rõ.
7. **Coder**: đọc workflow coder của template, Remotion best-practices liên quan; cập nhật `src/scenes/episode<N>/`, `src/VideoContent.tsx`, chỉ sửa `defaultSlug`/`defaultDuration` trong `src/Root.tsx` trừ khi template yêu cầu khác; áp đúng policy audio đã chọn (không suy luận lại từ tên template); `npx tsc --noEmit` phải sạch.
8. **Verify & Render**: soát lỗi hình (chồng chữ, tràn khung, chữ khó đọc, timing lệch) trước khi render thật. **Trước khi render lần cuối: xin chủ duyệt bằng card** (nội dung: slug, template, độ dài video, ước tính chi phí compute render — tham khảo `cost-report.mjs` của lần gần nhất nếu có). Render: `npx remotion render src/Root.tsx Video --output <đường dẫn> --codec h264 --props '{"slug":"<slug>"}'`, sau đó `node scripts/cost-report.mjs "<slug>"` để có `cost.json` thật.

## Điều kiện hoàn tất

`audio.txt`, `spec.json`, `voice.mp3`, `timeline.json` tồn tại; TypeScript biên dịch sạch; scene timing khớp tổng độ dài theo audio; `videos/<slug>/output/video.mp4` tồn tại.

Xong thì báo PM/Preview (qua `coordinate_bots`, không tự đăng gì ra ngoài): đường dẫn `video.mp4`, `thumbnail.png`, `cost.json`, và `output/post-facebook.md` nếu pipeline đã tạo caption nháp.

## Lỗi

Context rỗng, template ID sai (liệt kê ID hợp lệ từ registry), giá trị `--audio` sai (báo đúng 4 giá trị hợp lệ), thư mục `videos/<slug>/` đã tồn tại, hay một bước pipeline lỗi: báo đúng bước và stderr liên quan rồi dừng — không tự ý bỏ qua bước verify hay render.
