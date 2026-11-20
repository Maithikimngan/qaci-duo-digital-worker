---
name: video-setup
title: Cài đặt môi trường dựng video
description: Cài Node/ffmpeg/Playwright/Chromium, tạo .env, xác nhận toolchain sẵn sàng trước lần tạo video đầu tiên trên máy chạy team.
triggers: setup môi trường video, cài đặt pipeline video, lần đầu chạy video
tags: video, setup, internal
license: Unspecified
author: QACI Duo
---

# Cài đặt môi trường dựng video

Chạy khi bắt đầu dùng team lần đầu trên một máy mới, hoặc khi `rebuild-build`-style lỗi báo thiếu toolchain. Đích tới là repo pipeline (`VIDEO_REPO_PATH` trong Môi trường của team) — luôn `cd` vào đó trước khi chạy bất kỳ lệnh nào dưới đây.

## Nền tảng hỗ trợ

macOS 14+, Windows 11+/Server 2019+, Ubuntu 22.04/24.04, Debian 12/13 được hỗ trợ đầy đủ; các distro Linux khác chạy best-effort. WSL tính như Linux — không chạy lệnh package manager Linux từ Windows gốc.

## Điều kiện cần trước

- Mạng ra được npm, CDN trình duyệt Playwright, API TTS/STT.
- Quyền cài package hệ thống (Homebrew trên macOS, Administrator trên Windows, `sudo` trên Linux).
- Còn ít nhất 2 GB dung lượng trống.

## Công cụ bắt buộc

| Công cụ | Yêu cầu | Vì sao |
|---|---|---|
| Node.js | 20.x, 22.x hoặc 24.x | Playwright pin bản này |
| npm | đi kèm Node.js | cài dependency, chạy script |
| Chromium (Playwright) | đúng bản Playwright của repo | cần cho `scripts/record-demo.mjs` |
| ffmpeg | có trong `PATH` | cần khi Gemini TTS trả PCM |

## Thực hiện (không dừng giữa chừng)

`/setup` là việc chạy xuyên suốt: bắt đầu rồi thì tiếp tục tới khi xong hoặc gặp chặn thật sự, không hỏi lại chủ "tiếp tục không" sau mỗi bước duyệt. Lệnh cần quyền hệ thống (`brew`, `winget`, `choco`, `sudo apt`, `dnf`, `pacman`, `playwright --with-deps`) thì xin đúng card phạm vi hẹp cho lệnh đó rồi làm tiếp ngay khi được duyệt — không coi thẻ duyệt là điểm dừng. Kiểm lại từng bước đã xong trước khi làm (để chạy lại `/setup` an toàn), và coi exit code khác 0 là dữ liệu để chẩn đoán chứ không phải lý do dừng ngay.

1. **Nhận diện nền tảng**: `darwin`/`win32`/Linux (đọc `/etc/os-release` nếu Linux). Ngoài bảng hỗ trợ thì báo "best effort" rồi vẫn tiếp tục.
2. **Node.js**: `node --version && npm --version`, phải là 20/22/24. Thiếu hoặc sai bản thì cài LTS (macOS `brew install node@22`; Windows `winget install --id OpenJS.NodeJS.LTS -e`; Debian/Ubuntu qua NodeSource rồi `apt-get install -y nodejs`; Fedora/RHEL `dnf install -y nodejs npm`; Arch `pacman -S --noconfirm nodejs npm`). Windows cần mở lại terminal nếu PATH chưa nhận `node`.
3. **ffmpeg**: `ffmpeg -version` chạy được thì bỏ qua; chưa có thì cài theo nền tảng (macOS `brew install ffmpeg`; Windows `winget install --id Gyan.FFmpeg -e`; Debian/Ubuntu `apt-get install -y ffmpeg`; Arch `pacman -S --noconfirm ffmpeg`).
4. **`npm install`** ở gốc repo, dùng đúng lockfile có sẵn.
5. **Chromium**: macOS/Windows `npx playwright install chromium`; Linux hỗ trợ đầy đủ thì `npx playwright install --with-deps chromium` (xin card trước vì có thể cần `sudo`); Linux best-effort thì chỉ `npx playwright install chromium`, báo rõ thiếu thư viện nếu có, không nhận là hỗ trợ đầy đủ.
6. **Kiểm toàn bộ toolchain**, tất cả phải qua: `node --version`, `npm --version`, `ffmpeg -version`, `npx playwright --version`, `npx playwright install --list` (phải thấy Chromium), `npx remotion versions`, `npx tsc --noEmit`, `npm test`.
7. **Tạo `.env`**: chưa có thì copy từ `.env.example` (không ghi đè nếu đã có). Biến cần chủ điền trước khi `video-gen` chạy được: ít nhất 1 trong `ELEVENLABS_API_KEY`/`GEMINI_API_KEY` (TTS, ưu tiên ElevenLabs), ít nhất 1 trong `GROQ_API_KEY`/`STT_API_KEY` (STT, ưu tiên Groq). Không bắt buộc: `ASPECT_RATIO` (mặc định `9:16`), `THEME` (`dark`), `SHOW_SUBTITLES` (`true`).

## Lỗi và cách phục hồi

Với mỗi bước lỗi: ghi exit code + stderr (không lộ secret) → phân loại (quyền/sandbox, mạng tạm thời, thiếu công cụ, cần refresh PATH, nền tảng không hỗ trợ, lỗi quyết định của project) → xin card phạm vi hẹp nếu là quyền/mạng rồi chạy lại đúng lệnh đó → thử lại đúng 1 lần cho lỗi mạng tạm thời, không lặp vô hạn → cài thiếu thì cài theo bảng trên rồi quay lại bước đó. Chỉ dừng hẳn khi: cần nhập mật khẩu admin ở prompt không truy cập được, cần khởi động lại terminal để nhận PATH mới, hết dung lượng, nền tảng/package-manager không hỗ trợ, hoặc dịch vụ ngoài lỗi dai dẳng sau khi đã thử lại.

Báo điểm dừng lại được: bước nào đã xong, bước đầu tiên chưa xong, chặn cụ thể là gì, lệnh nào chạy trước khi resume.

## Báo cáo

Nền tảng phát hiện, mức hỗ trợ, trạng thái từng công cụ (Node/npm/ffmpeg/Playwright/Chromium/Remotion), `.env` được tạo mới hay đã có sẵn, và nhắc chủ điền API key trước khi dùng `video-gen`.
