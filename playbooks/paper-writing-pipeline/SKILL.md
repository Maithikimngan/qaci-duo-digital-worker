---
name: paper-writing-pipeline
title: Quy trình viết paper
description: Dựng quy trình viết paper bằng LaTeX từ dàn ý đến bản hoàn chỉnh, kiểm tra nhất quán và đối chiếu paper với code để mọi con số đều có nguồn.
triggers: viết paper, LaTeX, dàn ý paper, kiểm tra nhất quán, paper khớp code
tags: research, writing, latex
license: MIT
author: QACI
---

# Quy trình viết paper

## Khi nào dùng

Bắt đầu viết paper hoặc chuẩn bị nộp và cần chắc chắn paper nhất quán và khớp với code.

## Đầu vào cần có

- Venue và template; ghi chú, kết quả và hình đã có.
- Repo code và các file kết quả.

## Các bước

1. Cài đặt: template của venue; thư mục `sections/`, `figures/`, `tables/`; macro cho tên phương pháp và số liệu lặp lại; BibTeX lấy từ nguồn chính thức (DBLP, trang venue).
2. Dàn ý: mỗi section một đoạn ý chính; contributions dạng bullet, mỗi ý trỏ tới thí nghiệm chứng minh nó.
3. Viết nháp từng section theo giọng văn của tác giả, dựa trên ghi chú và câu tác giả đã viết. Chỗ thiếu bằng chứng đánh dấu `[TODO]` thay vì bịa.
4. Kiểm tra nhất quán: thuật ngữ và ký hiệu, tên dataset và metric, số liệu giữa abstract, intro và bảng, tham chiếu hình, bảng và section, citation đều có trong file `.bib`.
5. Đối chiếu paper với code: mỗi con số trong bảng truy được về file kết quả và commit; mỗi chi tiết cài đặt (learning rate, batch, epoch, kiến trúc) khớp file cấu hình.
6. Chuẩn bị trước reviewer: liệt kê 5-10 câu hỏi dễ bị hỏi và chỗ paper đã trả lời.

## Kết quả trả về

- Dự án LaTeX biên dịch được.
- Bảng đối chiếu "số liệu → file kết quả → commit".
- Danh sách điểm chưa nhất quán và câu hỏi reviewer dự kiến.

## Không được làm

- Không bịa citation hay số liệu.
- Không tự thêm đóng góp mà tác giả chưa xác nhận.
- Không nộp bài thay tác giả.
