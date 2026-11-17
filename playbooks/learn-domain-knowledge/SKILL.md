---
name: learn-domain-knowledge
title: Học nhanh kiến thức miền
description: Học nhanh một miền dữ liệu mới (X-ray, ECG, CT, EHR, SOAP notes...) đủ để thiết kế mô hình đúng, gồm đặc điểm dữ liệu, cách gán nhãn, thước đo và các bẫy thường gặp.
triggers: học kiến thức miền, domain knowledge, dữ liệu y tế, ECG, X-ray, CT, EHR, SOAP note
tags: research, domain, medical
license: MIT
author: QACI
---

# Học nhanh kiến thức miền

## Khi nào dùng

Người nghiên cứu ML bắt đầu làm với một loại dữ liệu chuyên ngành chưa quen và cần hiểu đủ để thiết kế mô hình, chia dữ liệu và chọn thước đo đúng.

## Đầu vào cần có

- Bài toán cần giải và loại dữ liệu (ví dụ ECG 12 đạo trình, X-ray ngực, ghi chú SOAP).
- Người dùng cuối của kết quả: bác sĩ, kỹ thuật viên, nhà nghiên cứu.

## Các bước

1. Giải thích ngắn dữ liệu được tạo ra thế nào: thiết bị, quy trình lâm sàng, ai ghi và khi nào.
2. Định dạng và cấu trúc: DICOM, WFDB, FHIR, văn bản tự do; các thành phần như đạo trình ECG hay mục S/O/A/P.
3. Liệt kê dataset công khai phổ biến: kích thước, giấy phép, cách gán nhãn và ai gán nhãn.
4. Thước đo người trong ngành dùng (AUROC, sensitivity ở specificity cố định, Dice, F1 theo lớp) và vì sao accuracy dễ đánh lừa.
5. Bẫy thường gặp: rò rỉ dữ liệu khi không chia theo bệnh nhân, mất cân bằng lớp, mô hình học "lối tắt" (ký hiệu trên phim, mã bệnh viện), lệch phân phối giữa bệnh viện hoặc thiết bị.
6. Chuyển thành quyết định thiết kế: đầu vào, tiền xử lý, kiến trúc gợi ý, baseline tối thiểu, cách chia dữ liệu.
7. Soạn bộ câu hỏi để hỏi chuyên gia miền.

## Kết quả trả về

- Ghi chú miền 1-2 trang.
- Bảng "đặc điểm dữ liệu → quyết định thiết kế".
- Câu hỏi cho chuyên gia miền và nguồn đọc thêm.

## Không được làm

- Không đưa lời khuyên chẩn đoán hay điều trị.
- Không xin hay dán dữ liệu bệnh nhân thật vào chat.
- Ghi rõ phần nào là kiến thức chung cần chuyên gia xác nhận.
