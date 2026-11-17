---
name: survey-a-field
title: Khảo sát một lĩnh vực
description: Lập bản đồ một lĩnh vực nghiên cứu, đọc kỹ các paper chính và kiểm tra ý tưởng có trùng công trình đã có, tách rõ điều đã kiểm với điều chỉ là phỏng đoán.
triggers: khảo sát lĩnh vực, literature review, related work, đọc paper, ý tưởng này đã có ai làm chưa
tags: research, literature
license: MIT
author: QACI
---

# Khảo sát một lĩnh vực

## Khi nào dùng

Bắt đầu một hướng mới, viết phần related work, hoặc cần biết một ý tưởng đã có người làm chưa.

## Đầu vào cần có

- Chủ đề hoặc câu hỏi nghiên cứu, càng cụ thể càng tốt.
- Tùy chọn: vài paper "hạt giống", venue mục tiêu, khoảng năm cần xem.

## Các bước

1. Viết lại câu hỏi thành 3-5 truy vấn: từ khoá chính, từ đồng nghĩa, tên benchmark hoặc dataset.
2. Tìm trên Google Scholar, Semantic Scholar, arXiv, OpenReview và proceedings của venue. Ghi truy vấn và nguồn của từng kết quả; không trích paper không mở được.
3. Gom kết quả thành 3-6 nhánh cách tiếp cận. Mỗi nhánh 2-5 paper tiêu biểu với: bài toán, phương pháp, dataset, kết quả chính, hạn chế tác giả tự nêu.
4. Đọc kỹ 3-5 paper quan trọng nhất: phương pháp, bảng kết quả và phần hạn chế, không chỉ abstract. Ghi số liệu kèm số bảng hoặc trang.
5. Kiểm tra trùng ý tưởng: so ý tưởng của người dùng với từng paper gần nhất theo bài toán, phương pháp, dữ liệu và cách đánh giá. Nêu cụ thể điểm giống và điểm khác.
6. Đánh dấu độ tin cậy cho từng khẳng định: **đã kiểm** (đọc trong paper, có trang hoặc bảng) hay **cần kiểm lại** (chỉ từ abstract, blog hoặc trí nhớ của mô hình).

## Kết quả trả về

- Bảng nhánh × paper: tên, năm, venue, link, ý chính.
- Mức trùng của ý tưởng: không trùng, trùng một phần, hoặc đã có người làm, kèm paper gần nhất.
- Danh sách điều người dùng nên tự kiểm lại.

## Không được làm

- Không bịa tên paper, tác giả, số liệu hay DOI. Không tìm thấy thì nói không tìm thấy.
- Không kết luận "chưa ai làm" chỉ vì không tìm ra; ghi rõ đã tìm ở đâu, bằng truy vấn nào.
