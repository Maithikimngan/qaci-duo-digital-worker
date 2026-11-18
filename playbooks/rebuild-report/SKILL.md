---
name: rebuild-report
title: Báo cáo cuối
description: Analyst báo cáo chủ khi việc dựng lại xong hoặc dừng - cơ sở quyền, chế độ, điểm khớp, khác biệt còn lại, đường dẫn bằng chứng. Dùng ở bước cuối.
triggers: rebuild report, báo cáo cuối
tags: adlc-craft, internal
license: Unspecified
author: QACI Duo
---

# Báo cáo cuối

Gửi chủ theo đúng thứ tự, mọi số lấy từ `PARITY.md` và output thật (ghi đường dẫn):

```
**Kết luận:** <đạt / đạt một phần / chưa đạt> — <một câu>

| Mục | Giá trị |
|---|---|
| Bản gốc | <loại, không ghi nội dung chưa có quyền> |
| Cơ sở quyền | <từ INTAKE.md, giờ chủ xác nhận> |
| Chế độ | clean room / Deep (giờ card) |
| Bản mới | <repo, commit, stack, lệnh chạy> |
| Spec | <số tiêu chí, giờ chủ duyệt> |
| Độ khớp | <tiêu chí đạt>/<tổng>; so ảnh 390/768/1440: <số đo> |
| Vòng sửa | <n>/<tối đa> |
| Test của bản mới | <đạt>/<tổng> |
| Khác biệt còn lại | <danh sách ngắn, vì sao chưa sửa> |
| Clean room | Engineer chỉ nhận spec/ và repo bản mới (theo LOG.md) |
| Card đã hỏi | <danh sách, giờ, kết quả> |
| Bằng chứng | <đường dẫn PARITY.md, ảnh, LOG.md> |
```

Thêm "Chưa kiểm" cho phần không đo được, kèm lý do. Không ghi "khớp" cho tiêu chí chỉ đo gián tiếp.
