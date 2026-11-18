---
name: rebuild-build
title: Dựng bản mới từ spec
description: Engineer dựng bản mới chỉ từ SPEC.md trong repo được giao, kèm test cho từng tiêu chí, không bao giờ truy cập bản gốc. Dùng khi Analyst giao việc rebuild.
triggers: rebuild build, dựng bản mới từ spec
tags: adlc-craft, internal
license: Unspecified
author: QACI Duo
---

# Dựng bản mới từ spec

## Bạn được đọc

- `spec/` (đường dẫn Analyst gửi): `SPEC.md`, `QUESTIONS.md`, `assets/`.
- `parity/PARITY.md` khi Checker trả khác biệt.
- Repo bản mới.

Không mở bất kỳ đường dẫn, URL hay thư mục nào khác liên quan tới bản gốc, kể cả `study/` hay `INTAKE.md` nằm cạnh `spec/`. Không tìm bản gốc trên mạng. Không dùng Craft Anything.

## Các bước

1. Đọc hết `SPEC.md`. Điều gì không rõ: ghi câu hỏi đánh số vào `spec/QUESTIONS.md` (mô tả bạn cần biết **hành vi** gì), báo Analyst đường dẫn file, kết thúc lượt. Không đoán phần quan trọng.
2. Repo bản mới: chưa có thì `git init -b main`. Làm trên nhánh `rebuild/<slug>`; commit nhỏ, đứng tên bạn: `git -c user.name="<tên bạn>" -c user.email="<tên viết thường>@users.noreply.local" commit -m "…"`.
3. Stack theo spec; không nói thì chọn cách đơn giản nhất chạy được (web tĩnh: HTML/CSS/JS thuần). Cần cài dependency thì báo Analyst để hỏi chủ bằng card trước, không tự cài.
4. Mỗi tiêu chí `A*` trong spec có ít nhất một test tự động khi đo được bằng code (logic, trạng thái, phím tắt); phần chỉ đo được bằng mắt thì ghi trong README là Checker kiểm bằng ảnh.
5. README: cách chạy, cách test, ghi chú "dựng từ spec, không dùng code hay tài sản của bản gốc".
6. Tự chạy test và chạy app một lần; ghi output thật.
7. Merge `rebuild/<slug>` vào `main` của repo bản mới (`git merge --no-ff`), rồi trả kết quả về Analyst trong tin cuối của lượt: đường dẫn repo, commit, lệnh chạy (vd `python3 -m http.server <cổng>` trong thư mục app), kết quả test. Không giao việc cho Checker: Analyst giao. Kết thúc lượt.

## Nhận PARITY.md

Sửa đúng các khác biệt được nêu, mỗi khác biệt một commit có ghi mã tiêu chí. Không sửa thêm ngoài phạm vi. Chạy lại test, trả kết quả về Analyst như bước 7.
