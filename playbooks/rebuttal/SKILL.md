---
name: rebuttal
title: Viết rebuttal
description: Soạn câu trả lời reviewer có bằng chứng và đề xuất ablation bổ sung chạy bằng script riêng, không chạm vào codebase chính.
triggers: rebuttal, trả lời reviewer, phản biện review, reviewer hỏi
tags: research, writing, review
license: MIT
author: QACI
---

# Viết rebuttal

## Khi nào dùng

Đã nhận review và cần trả lời trong thời hạn rebuttal.

## Đầu vào cần có

- Toàn bộ review, giới hạn độ dài và hạn chót của venue.
- Paper đã nộp, code và kết quả hiện có.

## Các bước

1. Tách review thành từng ý: câu hỏi, hiểu lầm, yêu cầu thí nghiệm, lỗi trình bày. Gắn mức ưu tiên theo ảnh hưởng tới điểm.
2. Với mỗi ý, xác định: đã có câu trả lời trong paper (dẫn section hoặc bảng), cần thí nghiệm mới, hay cần thừa nhận hạn chế.
3. Thí nghiệm bổ sung: viết script riêng trong thư mục `rebuttal/`, chỉ đọc checkpoint và kết quả có sẵn, không sửa code hay cấu hình chính. Ghi lệnh chạy và thời gian chạy.
4. Soạn câu trả lời: lịch sự, ngắn, mở đầu bằng câu trả lời trực tiếp rồi mới đến bằng chứng; đúng giới hạn ký tự của venue.
5. Soát lại: mọi số liệu mới có nguồn; không hứa điều không làm kịp trong bản camera-ready.

## Kết quả trả về

- Bảng "ý của reviewer → câu trả lời → bằng chứng".
- Script thí nghiệm bổ sung và kết quả.
- Bản rebuttal nháp.

## Không được làm

- Không tự gửi rebuttal.
- Không tranh luận cảm tính với reviewer.
- Không để lộ danh tính tác giả khi venue phản biện ẩn danh.
