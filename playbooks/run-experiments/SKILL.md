---
name: run-experiments
title: Thiết kế và chạy thí nghiệm
description: Dựng pipeline dữ liệu, baseline và ablation, đọc log huấn luyện và phân tích ca thất bại để biết kết quả có đáng tin hay không.
triggers: chạy thí nghiệm, baseline, ablation, đọc training log, phân tích lỗi, failure case
tags: research, experiments
license: MIT
author: QACI
---

# Thiết kế và chạy thí nghiệm

## Khi nào dùng

Prototype đã chạy và cần kết quả đủ chặt để đưa vào paper.

## Đầu vào cần có

- Câu hỏi thí nghiệm cần trả lời.
- Dữ liệu, cấu hình, tài nguyên tính toán có sẵn.

## Các bước

1. Lập bảng thí nghiệm: câu hỏi, biến thay đổi, biến cố định, metric, seed, cấu hình.
2. Pipeline dữ liệu: chia tập cố định và lưu lại; kiểm tra rò rỉ (mẫu trùng, cùng bệnh nhân hoặc người dùng ở cả train và test); thống kê phân phối nhãn.
3. Baseline: ít nhất một baseline đơn giản và một baseline mạnh đã công bố. Tái hiện số liệu gốc của baseline trước khi so.
4. Ablation: bỏ từng thành phần đề xuất, mỗi lần đổi một yếu tố. Chạy ít nhất 3 seed, báo trung bình ± độ lệch chuẩn.
5. Đọc log huấn luyện: loss train và val, learning rate, gradient norm, NaN, overfit, độ lệch giữa các seed. Ghi nhận xét kèm số bước.
6. Phân tích lỗi: lấy mẫu ca sai theo nhóm (lớp, độ dài, nguồn dữ liệu), tìm mẫu hình chung, nêu giả thuyết và thí nghiệm kế tiếp.

## Kết quả trả về

- Bảng kết quả có seed, cấu hình và commit.
- Nhận xét về log huấn luyện và phân tích ca thất bại.
- Đề xuất bước tiếp theo.

## Không được làm

- Không chọn seed hay checkpoint tốt nhất dựa trên tập test.
- Không báo kết quả chưa chạy hoặc số ước lượng như kết quả thật.
- Không sửa tập test.
