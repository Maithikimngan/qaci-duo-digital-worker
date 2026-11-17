# Định dạng playbook (BotMRR Markdown v1)

Một file `.md` gồm hai phần:

1. **YAML ở đầu file** (giữa hai dòng `---`): QACI Duo đọc phần này để tạo team.
2. **Phần thân Markdown:** hướng dẫn cho người và agent đọc.

## Phần YAML

| Trường | Bắt buộc | Ghi chú |
|---|---|---|
| `botmrr` | có | Luôn là `1` |
| `id` | có | Trùng tên file, chữ thường và `-` |
| `release` | có | Semver, ví dụ `1.0.0` |
| `name`, `tagline`, `summary` | có | Tối đa 100 / 160 / 2000 ký tự |
| `category`, `author.name`, `license` | có | |
| `featured` | không | `true` để đưa lên đầu thư viện (người phụ trách quyết định) |
| `outcomes` | có | 1-12 dòng |
| `setupMinutes` | có | 1-240 |
| `requirements.apps` | không | Mỗi app có `slug`, `label`, `reason`, `optional`. Không kèm token |
| `agents` | có | 1-50 DW: `key`, `name`, `title`, `description`, `appearance.color`, `playbooks` |
| `chiefOfStaff` | không | `key` của DW điều phối |
| `rooms` | không | `key`, `name`, `members`, `bulletin`, `defaultResponder` (`agent`, `everyone` hoặc `mentions`) |
| `routines` | không | `key`, `name`, `agent`, `prompt`, `runOn` (`maus`/`cloud`), `schedule`, `durationMinutes` (5-240), **`enabledAfterInstall: false`** |
| `playbooks` | có | Ít nhất 1: `key`, `name`, `summary`, `triggers`, `instructions` |

Màu hợp lệ: `green`, `blue`, `red`, `orange`, `purple`, `cyan`, `pink`, `yellow`, `teal`, `coral`.

Lịch chạy `daily`: `time: "HH:MM"` và `weekdays` là các số 0-6 (0 = Chủ nhật). Lịch chạy `once`: `at` là thời điểm (ms).

## Phần thân

Bắt buộc có đủ 7 mục:

`## Activation` · `## Mission` · `## Outcomes` · `## Connections` · `## Team` · `## Chief of Staff` · `## Completion rule`

Có thể thêm `## Shared rooms`, `## Suggested routines`, `## Playbooks`, `## Example job`.

## Thư viện được sinh ra

`npm run build` (và workflow publish sau mỗi lần merge) sinh ra từ mỗi file:

- `catalog.json` (`openmaus.catalog` v1) mà QACI Duo đọc
- `teams/<id>/team.mausteam.json`, `teams/<id>/README.md`, `teams/<id>/skills/<playbook>/SKILL.md`

Không sửa tay các file này; chúng nằm ở nhánh `library`.
