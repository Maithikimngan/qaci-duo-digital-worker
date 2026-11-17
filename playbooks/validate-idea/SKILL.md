---
name: validate-idea
title: Kiểm chứng ý tưởng và chọn hướng
description: Đánh giá một ý tưởng nghiên cứu (điểm mạnh, điểm yếu, giải pháp ứng viên, độ mới) rồi đề xuất một hướng kèm thí nghiệm nhỏ nhất để biết hướng đó đúng hay sai.
triggers: kiểm chứng ý tưởng, validate idea, ý tưởng này có mới không, chọn hướng nghiên cứu, novelty check
tags: research, ideation
license: MIT
author: QACI
---

# Kiểm chứng ý tưởng và chọn hướng

## Khi nào dùng

Có một ý tưởng hoặc vài hướng đang phân vân và cần quyết định có nên đầu tư thời gian hay không.

## Đầu vào cần có

- Ý tưởng mô tả bằng lời của người nghiên cứu.
- Ràng buộc: dữ liệu có sẵn, GPU, thời hạn, venue mục tiêu.

## Các bước

1. Viết lại ý tưởng thành giả thuyết kiểm chứng được: "Nếu làm X thì Y cải thiện Z trên dữ liệu D".
2. Khảo sát nhanh 5-10 công trình gần nhất; dùng playbook `survey-a-field` nếu chưa có bản đồ lĩnh vực.
3. Điểm mạnh và điểm yếu: đóng góp, rủi ro kỹ thuật, dữ liệu, tài nguyên tính toán, thời gian.
4. Đề xuất 2-4 giải pháp ứng viên; mỗi cái có ý chính, chi phí, rủi ro và baseline cần so.
5. Kiểm tra độ mới: với từng ứng viên, nêu paper gần nhất và khác biệt cụ thể. Tự phản biện như reviewer khó tính ("đây chỉ là A cộng B?").
6. Chấm điểm các ứng viên theo độ mới, khả thi, tác động và chi phí. Đề xuất một hướng, thí nghiệm nhỏ nhất (tối đa một tuần) để kiểm tra, và tiêu chí dừng.

## Kết quả trả về

- Bảng giải pháp ứng viên với điểm và lý do.
- Hướng đề xuất, thí nghiệm đầu tiên và tiêu chí dừng.

## Không được làm

- Không kết luận "mới" khi chưa dẫn paper gần nhất.
- Quyết định cuối thuộc về người nghiên cứu; DW chỉ đề xuất.
