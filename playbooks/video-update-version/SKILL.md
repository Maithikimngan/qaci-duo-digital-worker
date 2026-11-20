---
name: video-update-version
title: Áp bản cập nhật của repo video
description: Đọc update-version/update-version.md, làm đúng theo hướng dẫn 1 lần rồi đánh dấu đã cập nhật, không tự bịa thêm bước.
triggers: cập nhật repo video, update version video
tags: video, maintenance, internal
license: Unspecified
author: QACI Duo
---

# Áp bản cập nhật của repo video

Đọc `update-version/update-version.md` ở gốc repo pipeline. Chủ cung cấp file này khi có bản cập nhật cần áp.

## Kiểm trạng thái trước

Chạy `npm run update-version`. In ra `Already updated` thì dừng ngay, báo đã áp rồi. File được coi là đã xong khi có 1 trong các dòng: `status: updated`, `status updated`, `<!-- status: updated -->` gần đầu file.

## Thực hiện

Còn hướng dẫn chưa áp thì: đọc toàn bộ `update-version/update-version.md`, làm đúng từng bước trong đó (**không tự thêm bước nào ngoài file**), chạy đúng phần kiểm tra file yêu cầu. Xong và kiểm đạt thì đánh dấu: `npm run update-version -- --mark-updated`.

Bước nào không rõ hoặc bị chặn: **không** đánh dấu đã cập nhật, báo chủ đúng chỗ bị chặn.

## Báo cáo

Đã bỏ qua vì đã cập nhật trước đó, hoặc đã đổi gì và file đã được đánh dấu `status: updated`.
