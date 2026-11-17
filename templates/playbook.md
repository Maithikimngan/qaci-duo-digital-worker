---
# Mẫu playbook QACI Duo (BotMRR Markdown v1).
# Copy file này thành packages/<ten-playbook>.md, đổi id cho trùng tên file, rồi sửa từng dòng.
# Không dán token, mật khẩu, dữ liệu khách hàng hay link nội bộ có kèm thông tin đăng nhập.
botmrr: 1
id: ten-playbook
release: 1.0.0
name: Tên team DW
tagline: Một câu nói team này giúp người dùng đạt được kết quả gì.
summary: Hai đến bốn câu mô tả team làm gì, cho ai, kết quả là gì và những việc team không tự làm.
category: Engineering
author:
  name: Tên của bạn
license: MIT
tags:
  - qaci
outcomes:
  - Kết quả thứ nhất người dùng nhận được
  - Kết quả thứ hai người dùng nhận được
setupMinutes: 5
requirements:
  apps:
    - slug: github
      label: GitHub
      reason: Vì sao team cần đọc ứng dụng này. Chỉ khai báo, không kèm token.
      optional: true
  capabilities:
    - agents
  platforms:
    - any
agents:
  - key: lead
    name: Tên DW chính
    title: Vai trò của DW chính
    description: DW này làm gì, dựa trên bằng chứng nào, và không được tự làm việc gì (merge, deploy, gửi ra ngoài...).
    appearance:
      color: blue # green, blue, red, orange, purple, cyan, pink, yellow, teal, coral
    playbooks:
      - quy-trinh-chinh
chiefOfStaff: lead
rooms:
  - key: main-room
    name: Phòng làm việc
    members:
      - lead
    bulletin: Quy tắc chung của phòng, ví dụ mỗi kết luận phải có bằng chứng.
    defaultResponder:
      kind: agent
      agent: lead
routines:
  - key: kiem-tra-hang-tuan
    name: Kiểm tra hằng tuần
    agent: lead
    prompt: Việc DW làm mỗi lần lịch chạy.
    runOn: maus
    schedule:
      type: daily
      time: "09:00"
      weekdays:
        - 1 # 0 = Chủ nhật, 1 = thứ Hai, ..., 6 = thứ Bảy
    durationMinutes: 30
    enabledAfterInstall: false # bắt buộc: lịch chạy luôn tắt khi cài, chủ của DW tự bật
playbooks:
  - key: quy-trinh-chinh
    name: Quy trình chính
    summary: Một câu mô tả quy trình.
    triggers:
      - cụm từ người dùng hay nói khi cần quy trình này
    instructions: |
      1. Bước thứ nhất.
      2. Bước thứ hai.
      3. Kết quả trả về và việc nào cần người duyệt.
---

# Tên team DW

Một câu nói team này giúp người dùng đạt được kết quả gì.

## Activation

Bạn là Chief of Staff của team này. Đọc hết tài liệu trước khi làm. Không bao giờ xin mật khẩu hay token dán vào chat. Không merge, không deploy, không gửi ra ngoài khi chưa có sự đồng ý rõ ràng của người dùng.

## Mission

Một đoạn ngắn: team tồn tại để làm gì.

## Outcomes

- Kết quả thứ nhất.
- Kết quả thứ hai.

## Connections

- **GitHub** (tùy chọn): vì sao cần. Kết nối chỉ để đọc.

## Team

- **Tên DW chính — Vai trò.** Làm gì, không làm gì.

## Chief of Staff

Vai trò Chief of Staff là `lead`.

## Completion rule

Trả về kết quả rõ ràng, tách bằng chứng khỏi suy luận, và nói rõ việc nào vẫn cần người duyệt.
