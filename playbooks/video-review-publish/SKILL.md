---
name: video-review-publish
title: Duyệt video và chuẩn bị đăng
description: Xem lại video Producer vừa dựng, đối chiếu với yêu cầu gốc và các lỗi hay gặp của pipeline, rồi xin chủ duyệt trước khi đưa caption nháp cho chủ tự đăng.
triggers: duyệt video, xem video trước khi đăng, chuẩn bị đăng video
tags: video, review, internal
license: Unspecified
author: QACI Duo
---

# Duyệt video và chuẩn bị đăng

Chạy sau khi {{agent:producer}} báo xong một video (`videos/<slug>/output/video.mp4`). Đây là bước **duy nhất đi ra ngoài hệ thống** của team — luôn cần chủ duyệt, không tự đăng thay chủ.

## Xem lại

1. Mở `videos/<slug>/output/video.mp4` và `thumbnail.png`. Xem hết video, không chỉ vài giây đầu.
2. Đối chiếu với `context.txt` (yêu cầu gốc chủ đưa) và `spec.json` (tiêu chí đã lập): nội dung đúng chủ đề chưa, độ dài hợp lý, không bị cắt cụt.
3. Soát các lỗi hay gặp của pipeline này (theo kinh nghiệm thật của repo):
   - Phụ đề/giọng đọc lệch nhịp (align-timeline STT khớp dưới 80% hay bị report trong log của Producer).
   - Tổng `durationFrames` các scene không khớp tổng thời lượng audio.
   - Watermark hiện đúng vị trí, không che nội dung quan trọng.
   - Nhạc nền/SFX đúng với `--audio` đã chọn (có/không đúng như yêu cầu).
4. Đọc `cost.json` nếu có — ghi lại chi phí thật của lần render này vào báo cáo.
5. Có `output/post-facebook.md` (caption nháp Producer/pipeline đã viết) thì đọc qua, sửa lại cho đúng giọng văn nếu cần — **đây chỉ là bản nháp văn bản, không phải đăng thật**.

## Xin duyệt

Gửi chủ 1 card: video đính kèm (hoặc đường dẫn), nhận xét đạt/chưa đạt theo bước trên, caption nháp (nếu có), và hỏi rõ: "Đồng ý" (chủ tự đăng, hoặc đổi bản mới) hay "Sửa lại" (nêu rõ chỗ cần Producer sửa).

**Chưa có công cụ đăng Facebook/mạng xã hội tự động trong team này** — `post-facebook.md` chỉ là văn bản nháp, chủ tự copy đăng. Muốn tự động đăng thật thì cần kết nối thêm app mạng xã hội cho bot (việc ngoài phạm vi hiện tại) — nói rõ điều này nếu chủ hỏi "sao chưa đăng".

Chưa đạt: giao lại {{agent:producer}} qua `coordinate_bots`, nêu đúng chỗ cần sửa (không đoán nguyên nhân khi chưa chắc).

## Báo cáo

Kết quả soát từng mục, chi phí thật từ `cost.json`, caption nháp (nếu có), và quyết định của chủ (đồng ý / sửa lại).
