---
name: video-sync-templates
title: Đồng bộ gói template đã mua
description: Cài các gói template đã copy vào load-templates/ — merge registry/manifest/docs/dependency an toàn, bảo toàn chỉnh sửa cục bộ, xin duyệt trước khi áp dụng thật.
triggers: sync template, đồng bộ template đã mua, cài gói template mới
tags: video, templates, internal
license: Unspecified
author: QACI Duo
---

# Đồng bộ gói template đã mua

Chủ copy sẵn 1 hay nhiều thư mục gói (mỗi gói có `template-package.json`) vào `load-templates/` ở gốc repo pipeline trước khi chạy. Nhận không tham số (đồng bộ hết) hoặc `--package <thư-mục>` (1 gói).

## Trước khi áp dụng thật

Việc này sửa `src/templates/registry.ts`, cài thêm npm dependency và có thể ghi đè file dùng chung — **luôn chạy `--dry-run` trước, đọc bản tóm tắt, rồi xin chủ duyệt bằng card** (nội dung: gói nào, file nào bị thêm/sửa, dependency nào cài thêm) trước khi chạy thật không có `--dry-run`.

```bash
npm run sync-templates -- --dry-run                                  # xem trước, không đổi gì
npm run sync-templates                                               # mọi gói trong load-templates/
npm run sync-templates -- --package <thư-mục>                       # 1 gói
npm run sync-templates -- --package <thư-mục> --skip-install         # chỉ soát offline, không cài dep
```

## Quy tắc merge (script tự làm, bạn chỉ cần biết để giải thích kết quả)

- Preflight đọc-chỉ (đường dẫn, checksum, tương thích, chủ sở hữu file, registry, manifest, env key, dependency) — gói xung đột nguy hiểm thì **không đổi file nào**.
- So registry entry và manifest JSON theo ngữ nghĩa (khác định dạng/thứ tự key không tính là xung đột).
- Dùng hash file đã cài lần trước (`.template-sync-state.json`) để phân biệt bản nâng cấp an toàn với chỉnh sửa tay của chủ; file vừa sửa tay vừa bị gói đổi thì merge 3 chiều.
- Namespace asset/manifest trùng theo package ID, asset giống hệt thì dùng lại, không nhân đôi.
- Nâng cấp registry entry: giữ `voice`/`defaultBgMusic` chủ đã tự chỉnh, vẫn nhận default mới của gói nếu chủ chưa từng đổi.
- Thêm env key còn thiếu vào cả `.env.example` và `.env` với giá trị rỗng — **không bao giờ ghi đè giá trị env đã có**.
- Áp từng gói như 1 transaction: cài dep thiếu, kiểm đường dẫn registry/docs/manifest, chạy TypeScript nếu có đổi source, lỗi thì rollback đúng gói đó — gói khác trong cùng batch vẫn tiếp tục.

Gói đã đồng bộ trước đó (theo `packageId@version`) thì bỏ qua.

## Lỗi

Thiếu `template-package.json`: bỏ qua thư mục đó, cảnh báo ngắn. Manifest gói không hợp lệ: dừng, báo đường dẫn. Đường dẫn/symlink/checksum khả nghi: từ chối, không đổi gì cho gói đó. File thực thi của gói bị chủ sửa tay không merge 3 chiều sạch được: từ chối, không tự đoán. `npm install` hay kiểm sau-sync lỗi: rollback gói đó, báo lệnh/lỗi.

Không tự chạy `video-gen` sau khi sync xong.

## Báo cáo

Gói đã đồng bộ/bỏ qua/lỗi, file đã copy/cập nhật/merge/giữ nguyên cục bộ, asset đã namespace, registry entry thêm/sửa, env key thêm, dependency đã cài.
