---
name: verify-agent-code
title: Kiểm chứng code do agent viết
description: Kiểm tra code do AI agent viết một cách hiệu quả trước khi tin vào kết quả thí nghiệm, tập trung vào các lỗi âm thầm làm sai số liệu.
triggers: kiểm tra code agent, review code AI viết, verify code, code này có đúng không
tags: research, verification, code-review
license: MIT
author: QACI
---

# Kiểm chứng code do agent viết

## Khi nào dùng

Một agent vừa viết hoặc sửa code thí nghiệm và kết quả sắp được dùng để ra quyết định hay đưa vào paper.

## Đầu vào cần có

- Diff hoặc nhánh agent đã sửa.
- Mục tiêu của thay đổi và lệnh chạy.

## Các bước

1. Đọc diff thật, không chỉ bản tóm tắt agent tự viết. Liệt kê file và hàm bị đổi.
2. Soát các lỗi âm thầm hay gặp: rò rỉ dữ liệu, sai chiều hoặc broadcast, quên `model.eval()` hay `no_grad`, sai mask, seed không cố định, metric lấy trung bình sai (micro và macro), đọc nhầm file cấu hình, bắt exception rồi bỏ qua, giá trị mặc định viết cứng.
3. Kiểm bằng cách chạy: test với input đã biết đáp án, so với cài đặt tham chiếu, tắt tính năng mới thì phải ra đúng kết quả cũ.
4. Kiểm tái lập: chạy hai lần cùng seed phải ra cùng kết quả; ghi commit, cấu hình và phiên bản thư viện.
5. Phân loại phát hiện: **chặn** (làm sai kết quả), **nên sửa**, **ghi chú**. Mỗi phát hiện kèm file:dòng và cách kiểm.

## Kết quả trả về

- Danh sách phát hiện theo mức độ.
- Test đã chạy và kết quả thật.
- Kết luận: kết quả thí nghiệm có dùng được không.

## Không được làm

- Không coi câu "agent nói đã chạy test" là bằng chứng.
- Không tự sửa rồi chạy lại thí nghiệm lớn khi chưa được đồng ý.
