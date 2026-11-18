---
name: rebuild-check
title: So khớp hai bản và ghi PARITY.md
description: Checker so hành vi bản mới với bản gốc từ bên ngoài bằng Craft Anything (ảnh nhiều bề rộng, so ảnh, thao tác) và tiêu chí trong SPEC.md, ghi PARITY.md, tối đa 3 vòng. Dùng khi Engineer báo xong.
triggers: rebuild check, so khớp hai bản và ghi parity.md
tags: adlc-craft, internal
license: Unspecified
author: QACI Duo
---

# So khớp hai bản và ghi PARITY.md

Bạn luôn ở clean room: chỉ quan sát hai bản từ bên ngoài. Không đọc code hay file bên trong bản gốc, không thêm `--deep`, không `--allow-run` nếu chưa có card trong `LOG.md`.

## 0. Chuẩn bị

- `CA` là dòng `CRAFT_ANYTHING_CLI` trong mục Môi trường; thiếu thì hỏi Analyst.
- Lấy từ Analyst: URL bản gốc (chỉ dùng để chụp và thao tác), đường dẫn `spec/`, `parity/`, `study/ca_session.py`.
- Chạy bản mới theo lệnh Engineer báo, trên một cổng loopback riêng, có giới hạn thời gian; ghi URL.

## 1. Chụp và so ảnh

Dùng helper `study/ca_session.py` (skill `rebuild-study` mục 1, một phiên MCP, cùng cờ `--restricted --allow-web --allow-capture --allow-run --clean-room`) cho mỗi bản, cùng bộ bề rộng 390, 768, 1440:

```json
[
  {"toolset": "browser"},
  {"tool": "web_site_open", "args": {"url": "<URL>"}},
  {"tool": "web_site_capture", "args": {"output_directory": "<parity tuyệt đối>/<orig|new>", "widths": [390, 768, 1440]}},
  {"tool": "web_site_close", "args": {}}
]
```

Rồi so từng cặp ảnh cùng bề rộng (lệnh rời, không cần phiên):

```bash
"$CA" web-pixels-compare --json '{"before":{"path":"<parity>/orig/screenshot-390.png"},"after":{"path":"<parity>/new/screenshot-390.png"},"common_area":true}'
```

Ghi `result.perceptual_similarity` (0..1, độ giống về đường nét, chữ, kết cấu) và `result.layout_similarity` (0..1, độ giống bố cục theo ô 16 px) cho mỗi bề rộng; lưu nguyên JSON vào `parity/compare-<bề rộng>.json`. Tool không chạy được thì ghi "chưa đo bằng tool" và lý do, không bịa số.

## 2. Thao tác và tiêu chí

- Với từng tiêu chí `A*` trong `SPEC.md`: kiểm trên bản mới bằng cách đo đúng như cột "Cách đo" (thao tác qua `web_walkthrough_record`/`web_walkthrough_check` khi có, hoặc chạy test của bản mới, hoặc ảnh chụp). Mỗi tiêu chí: Đạt / Không đạt / Chưa kiểm, kèm bằng chứng.
- Kịch bản thao tác ghi lại trên bản gốc rồi chạy lại trên bản mới chỉ dùng hành động nhìn thấy từ bên ngoài (bấm, gõ phím, chờ).

## 3. `parity/PARITY.md`

```
# Parity vòng <n>
| Bề rộng | perceptual_similarity | layout_similarity | Ảnh gốc | Ảnh mới |
|---|---|---|---|---|

| Mã | Tiêu chí | Kết quả | Bằng chứng |
|---|---|---|---|
## Khác biệt cần sửa
1. <A*>: <mô tả hành vi khác, không kèm nội dung bản gốc chưa có quyền dùng>
```

Ngưỡng mặc định: `perceptual_similarity` ≥ 0,85 ở cả ba bề rộng và mọi tiêu chí `A*` Đạt. `layout_similarity` ghi để tham khảo.

## 4. Vòng sửa

`PARITY.md` và mọi thứ chuyển cho Engineer chỉ mô tả **tiêu chí nào chưa đạt và khác biệt ở mức hành vi hay bố cục** (vd "ở bề rộng 390, các tab tràn khỏi khung"). Không chép số đo pixel, mã màu, font, ảnh hay chữ lấy từ bản gốc, trừ khi `INTAKE.md` ghi bản gốc là của chủ; ảnh so sánh của bản gốc chỉ để Analyst xem, không đưa Engineer.

Mỗi vòng: trả kết quả về Analyst trong tin cuối của lượt (đạt hay không, số vòng, đường dẫn `PARITY.md`), dừng mọi server bạn đã chạy, kết thúc lượt. Không giao việc trực tiếp cho Engineer: Analyst quyết định vòng tiếp (tối đa 3).
