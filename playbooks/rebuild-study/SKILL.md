---
name: rebuild-study
title: Nghiên cứu bản gốc bằng Craft Anything
description: Analyst nghiên cứu bản gốc bằng Craft Anything (CLI và một phiên MCP cho website), ghi evidence vào study/. Dùng sau rebuild-intake, chỉ khi INTAKE.md đã có cơ sở quyền.
triggers: rebuild study, nghiên cứu bản gốc bằng craft anything
tags: adlc-craft, internal
license: Unspecified
author: QACI Duo
---

# Nghiên cứu bản gốc bằng Craft Anything

Chỉ chạy khi `INTAKE.md` đã ghi cơ sở quyền. Mọi file ra nằm trong `study/` của việc. Không bao giờ gửi gì trong `study/` cho Engineer.

## 0. Công cụ

- Đường dẫn CLI là dòng `CRAFT_ANYTHING_CLI` trong mục Môi trường của hướng dẫn chung. Đặt `CA=<đường dẫn đó>`. Thiếu hoặc còn để `<…>` thì hỏi chủ.
- Kiểm một lần mỗi việc: `perl -e 'alarm shift; exec @ARGV' 120 "$CA" doctor` phải có `healthy`. Thiếu trình duyệt (cho website) hay engine khác thì báo chủ, không tự cài.
- Mặc định chạy **clean room**. Không bao giờ thêm `--allow-run` hay `--deep` nếu chưa có card tương ứng của chủ trong `LOG.md`.
- Tool trả `consent_required`: dừng, gửi card nói đúng tool và việc nó sẽ làm, chủ đồng ý thì chạy lại đúng lệnh đó với `--allow-run`, ghi vào `LOG.md`.

## 1. Website hay web app: một phiên MCP

Các tool web giữ trạng thái (trang đang mở) trong **một phiên**, nên không gọi rời từng lệnh CLI. Dùng helper dưới đây: nó mở `"$CA" mcp`, chạy lần lượt các bước trong một file JSON, ghi kết quả từng bước.

Ghi helper một lần vào `study/ca_session.py`:

```python
import json, subprocess, sys
cli, steps_file, out_file, flags = sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4:]
steps = json.load(open(steps_file))
p = subprocess.Popen([cli, "mcp", *flags], stdin=subprocess.PIPE, stdout=subprocess.PIPE, text=True, bufsize=1)
n = 0
def call(method, params=None, note=False):
    global n
    msg = {"jsonrpc": "2.0", "method": method}
    if params is not None: msg["params"] = params
    if not note:
        n += 1; msg["id"] = n
    p.stdin.write(json.dumps(msg) + "\n"); p.stdin.flush()
    if note: return None
    while True:
        line = p.stdout.readline()
        if not line: raise SystemExit("mcp server closed")
        reply = json.loads(line)
        if reply.get("id") == n: return reply
call("initialize", {"protocolVersion": "2025-06-18", "capabilities": {}, "clientInfo": {"name": "qaciduo-rebuild", "version": "1"}})
call("notifications/initialized", note=True)
results = []
for step in steps:
    if "toolset" in step:
        results.append({"enable": step["toolset"], "reply": call("tools/call", {"name": "enable_toolset", "arguments": {"toolset": step["toolset"]}})})
        continue
    reply = call("tools/call", {"name": step["tool"], "arguments": step.get("args", {})})
    results.append({"tool": step["tool"], "reply": reply})
json.dump(results, open(out_file, "w"), ensure_ascii=False, indent=1)
p.stdin.close(); p.wait(timeout=30)
```

Bước mẫu cho một website (`study/steps-capture.json`), URL và thư mục thay đúng việc:

```json
[
  {"toolset": "browser"},
  {"tool": "web_site_open", "args": {"url": "<URL bản gốc>"}},
  {"tool": "web_site_capture", "args": {"output_directory": "<study tuyệt đối>/capture", "widths": [390, 768, 1440]}},
  {"tool": "web_page_states_capture", "args": {"output_directory": "<study tuyệt đối>/states"}},
  {"tool": "web_site_close", "args": {}}
]
```

Mở một trang là chạy script của trang trong trình duyệt riêng, nên tool cần đồng ý. Card quyền ở `rebuild-intake` đã hỏi điều này cho website; có trong `INTAKE.md` thì chạy phiên ở **chế độ chỉ có tool web**, không mở được tool nào khác:

`perl -e 'alarm shift; exec @ARGV' 900 python3 study/ca_session.py "$CA" study/steps-capture.json study/capture-result.json --restricted --allow-web --allow-capture --allow-run --clean-room`

Lần đầu chạy trên một máy, trình duyệt của Craft Anything khởi động chậm và `web_site_open` có thể trả `timed_out` dù trang vẫn chạy: chạy lại helper một lần (trình duyệt đã sẵn), hoặc đặt hai bước `web_site_open` liên tiếp với `"timeout_secs": 90`. Lỗi lặp lại lần thứ hai mới báo chủ. Không đọc mã nguồn trang để thay cho việc xem trang.

Kết quả: mỗi bề rộng một `screenshot-<bề rộng>.png`, `capture.json` (design token, bố cục, outline) và `README.md` trong thư mục capture. Đọc `capture-result.json`: bước nào `isError` thì đọc `code` (`consent_required`, `not_found`…) và xử lý như mục 0. Kết quả lớn trả bản tóm tắt; xem tiếp bằng bước `core_evidence_browse` trong một lần chạy helper khác.

Tên và tham số tool có thể khác theo phiên bản: chưa chắc thì xem `"$CA" <tên-tool-dùng-gạch-ngang> --help`, hoặc bước `{"tool": "list_toolsets"}`.

## 2. App, file hay thư mục: lệnh CLI rời

Mỗi lệnh là một phiên, thêm `--json`: vd `"$CA" core-target-open <đường dẫn> --json`, `"$CA" core-target-triage --json`, rồi toolset hợp với loại target (`js-app-map` cho app JS…). Mở target rồi gọi tool phân tích trong **cùng** một lệnh helper nếu tool cần target đang mở.

## 3. Ghi chép

Trong `study/notes.md` ghi theo hành vi, mỗi ý kèm đường dẫn evidence: màn hình (ảnh trong `capture/`), luồng thao tác đã thấy, trạng thái và dữ liệu, thông báo lỗi, phím tắt. Đây là nguồn để viết spec (skill `rebuild-spec`). Ghi vào `LOG.md`: lệnh đã chạy, thời gian, lỗi.
