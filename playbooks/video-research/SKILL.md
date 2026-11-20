---
name: video-research
title: Nghiên cứu nội dung trước khi viết kịch bản
description: Tìm và kiểm chứng thông tin cho chủ đề video, ghi RESEARCH.md có nguồn rõ ràng, giao Producer viết kịch bản từ đó thay vì từ trí nhớ của model.
triggers: nghiên cứu chủ đề video, research nội dung video, kiểm chứng thông tin video
tags: video, research, internal
license: Unspecified
author: QACI Duo
---

# Nghiên cứu nội dung trước khi viết kịch bản

Chạy trước `video-gen`, khi {{agent:producer}} giao một chủ đề cần nghiên cứu (không phải khi chủ đã tự viết sẵn kịch bản/nội dung chi tiết đủ dùng ngay). Mục tiêu: giảm bịa số liệu/khái niệm sai trong video giáo dục, kỹ thuật, tin tức — nội dung quan trọng phải có nguồn, không chỉ dựa trí nhớ của model.

## Đầu vào

Chủ đề hoặc câu hỏi ngắn {{agent:producer}} chuyển lại (nguyên văn chủ đưa), kèm template đã chọn nếu có (vd `source-led`/`article-video-demo` đã có sẵn 1 URL — đọc đúng URL đó trước, không tự tìm nguồn khác thay thế).

## Các bước

1. **Có URL/nguồn chủ đưa sẵn** (template `source-led`, `article-video-demo`, hay chủ dán link): đọc kỹ nguồn đó trước. Đủ thông tin thì không cần tìm thêm; thiếu góc nhìn hay số liệu thì tìm bổ sung, ghi rõ nguồn nào bổ sung thêm.
2. **Không có nguồn sẵn** (chủ đề chung, free-style): tìm thông tin thật qua web search, ưu tiên nguồn chính thống hoặc tài liệu gốc (paper, tài liệu hãng, số liệu chính thức) hơn bài tổng hợp lại.
3. Với mỗi khái niệm/số liệu/claim sẽ đưa vào kịch bản: ghi **nguồn cụ thể** (tên + link nếu có) ngay cạnh. Không đưa vào kịch bản điều không kiểm chứng được — đánh dấu rõ "chưa kiểm chứng, Producer cân nhắc bỏ" thay vì âm thầm bỏ qua hay bịa cho trôi.
4. Tóm nội dung thành dàn ý ngắn gọn, hợp với video ngắn (không phải bài viết dài): các điểm chính theo đúng thứ tự muốn kể, mỗi điểm 1-2 câu, kèm nguồn.
5. Ghi `RESEARCH.md` vào `sharedBotFolder/video-research/<slug-tạm>/RESEARCH.md` (đặt tên slug tạm theo chủ đề, không cần trùng slug video sau này). Gồm: chủ đề gốc, dàn ý có nguồn, danh sách claim chưa kiểm chứng (nếu có), link nguồn đã dùng.
6. Báo {{agent:producer}} đường dẫn `RESEARCH.md`, kết thúc lượt.

## Không làm

- Không tự chạy `video-gen` hay chạm vào bất kỳ file `videos/<slug>/` nào — đó là việc của Producer.
- Không đưa claim chưa kiểm chứng vào dàn ý như thể đã chắc chắn.
- Không cần card duyệt cho việc tìm kiếm thông tin công khai (không tốn tiền, không rời hệ thống) — chỉ cần card khi phải đăng nhập hay trả phí để đọc một nguồn cụ thể, lúc đó hỏi chủ trước.

## Báo cáo

Đường dẫn `RESEARCH.md`, số nguồn đã dùng, và có claim nào bị đánh dấu "chưa kiểm chứng" hay không.
