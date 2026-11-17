---
# Mẫu Digital Worker (DW) của QACI Duo: một DW là một bot, mang các playbook trong playbooks/.
# Copy thành workers/<ten-dw>.md và đổi id cho trùng tên file.
id: ten-dw
release: 1.0.0
name: Tên DW
title: Vai trò của DW
tagline: Một câu nói DW giúp người dùng đạt kết quả gì.
description: DW làm gì, dựa trên bằng chứng nào và không tự làm việc gì. Đây là mô tả QACI Duo dùng cho bot.
category: Research
author:
  name: Tên của bạn
license: MIT
tags:
  - research
color: blue # green, blue, red, orange, purple, cyan, pink, yellow, teal, coral
outcomes:
  - Kết quả thứ nhất người dùng nhận được
setupMinutes: 5
playbooks:
  - ten-playbook # tên thư mục trong playbooks/
---

# Tên DW

## Mission

Một đoạn ngắn: DW tồn tại để làm gì, cho ai.

## Working rules

Quy tắc DW luôn giữ: hỏi gì trước khi làm, dẫn nguồn ra sao, việc nào cần người duyệt. Không bao giờ xin mật khẩu hay token dán vào chat.

## Completion rule

Thế nào là xong: kết quả trả về, cách tách bằng chứng khỏi suy luận, việc nào còn chờ người quyết định.
