---
name: rebuild-spec
title: Viết SPEC.md
description: Analyst viết spec/SPEC.md chỉ mô tả hành vi bản gốc, có tiêu chí chấp nhận đo được, rồi xin chủ duyệt và giao Engineer. Dùng sau rebuild-study.
triggers: rebuild spec, viết spec.md
tags: adlc-craft, internal
license: Unspecified
author: QACI Duo
---

# Viết SPEC.md

`SPEC.md` là thứ **duy nhất** về bản gốc mà Engineer được thấy. Viết sao cho một người chưa từng thấy bản gốc dựng được bản có cùng hành vi.

## Mẫu `spec/SPEC.md`

```
# Spec: <tên bản mới>  (không dùng tên hay thương hiệu của bản gốc)

## Mục tiêu
<2–3 câu: app làm gì, cho ai>

## Màn hình
### M1. <tên>
- Bố cục: <vùng nào ở đâu, tỉ lệ, thứ tự>, theo bề rộng 390 / 768 / 1440 nếu khác nhau
- Thành phần: <nút, ô nhập, danh sách…> và trạng thái (mặc định, hover, đang chạy, vô hiệu)
- Màu và chữ: mô tả (vd "nền tối, màu nhấn đỏ cam"), không chép mã màu hay font độc quyền nếu chưa có quyền

## Luồng người dùng
1. <hành động> → <kết quả nhìn thấy>
…

## Trạng thái và dữ liệu
<dữ liệu nào được lưu, ở đâu (localStorage, file), khi nào reset>

## Lỗi và trường hợp biên
<…>

## Yêu cầu khác
<phím tắt, âm thanh, khả năng truy cập, hiệu năng, chạy offline…>

## Tiêu chí chấp nhận (Checker dùng để chấm)
| Mã | Tiêu chí | Cách đo |
|---|---|---|
| A1 | <…> | <ảnh chụp ở 390/768/1440 / thao tác / test> |

## Tài sản được phép dùng
<danh sách file trong spec/assets/ chủ đã cho phép, hoặc "không có: tự tạo">
```

## Tự kiểm trước khi gửi

- [ ] Không có khối code, tên biến, tên hàm, đường dẫn file hay URL của bản gốc.
- [ ] Không chép nguyên văn quá một câu chữ hiển thị; nhãn nút ngắn chỉ dùng khi là từ thông dụng (vd "Bắt đầu").
- [ ] Không có logo, ảnh, âm thanh chưa có quyền; ảnh minh hoạ nếu có thì là ảnh chủ cho phép, đặt trong `spec/assets/`.
- [ ] Ít nhất 8 tiêu chí chấp nhận, mỗi tiêu chí đo được.

## Duyệt và giao

1. Gửi chủ tóm tắt spec và đường dẫn, rồi card "Duyệt SPEC" (điểm `spec`, luôn hỏi theo dòng `Điểm duyệt:` của team). Sửa theo ý chủ, hỏi lại tới khi đồng ý.
2. Giao Engineer qua `coordinate_bots`: "Loại việc: rebuild. Quy trình: skill rebuild-build", kèm **chỉ** đường dẫn tuyệt đối tới `spec/`, đường dẫn repo bản mới, stack, và `done_when`: "app chạy được, có test cho từng tiêu chí A*, đã trả kết quả về Analyst". Không kèm bất cứ đường dẫn nào khác. `spec/` chỉ chứa spec, câu hỏi và tài sản được phép: không đặt script hay ghi chú nghiên cứu vào đó.
3. Engineer trả kết quả thì giao Checker (skill `rebuild-check`) kèm URL bản gốc, đường dẫn `study/`, `spec/`, `parity/` và repo bản mới. Checker trả `PARITY.md` thì: đạt hoặc hết 3 vòng → báo cáo (skill `rebuild-report`); chưa đạt → giao lại Engineer kèm đường dẫn `PARITY.md`.
4. Ghi vào `LOG.md`: giờ duyệt, giờ giao, nội dung đã gửi Engineer, số vòng.
