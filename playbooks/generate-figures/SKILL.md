---
name: generate-figures
title: Vẽ hình cho paper
description: Vẽ hình cho paper từ kết quả thô và insight của chính người nghiên cứu, thử hai phương án rồi chọn, giữ script vẽ để tái tạo được.
triggers: vẽ hình, figure, biểu đồ cho paper, plot kết quả
tags: research, writing, figures
license: MIT
author: QACI
---

# Vẽ hình cho paper

## Khi nào dùng

Đã có kết quả thí nghiệm và cần hình cho paper, poster hoặc slide.

## Đầu vào cần có

- File kết quả thô (CSV, JSON, log) và thông điệp hình cần truyền tải.
- Template của venue: số cột, font, giới hạn trang.

## Các bước

1. Hỏi thông điệp của hình: người đọc phải thấy điều gì trong 5 giây. Ghi insight bằng lời của người nghiên cứu trước khi vẽ.
2. Đọc kết quả thô, không dùng số chép tay; kiểm tra số liệu khớp với bảng trong paper.
3. Chọn loại biểu đồ theo thông điệp: so sánh dùng bar hoặc dot, xu hướng dùng line, phân phối dùng box hoặc violin, quan hệ dùng scatter. Có error bar khi chạy nhiều seed.
4. Làm hai phương án khác nhau (hai cách bố cục, hoặc hai agent cùng vẽ một hình) rồi so theo: đúng thông điệp, đọc được khi in đen trắng, font khớp paper, vừa cột đơn hoặc cột đôi.
5. Xuất vector (PDF hoặc SVG), chữ không nhỏ hơn caption, bảng màu thân thiện với người mù màu, nhãn trục có đơn vị.
6. Lưu script vẽ cạnh dữ liệu để vẽ lại khi số liệu đổi.

## Kết quả trả về

- Script vẽ, file hình, caption nháp.
- Ghi chú vì sao chọn phương án này.

## Không được làm

- Không làm đẹp số liệu: không cắt trục gây hiểu lầm, không bỏ seed xấu.
- Không vẽ từ số liệu không có nguồn.
