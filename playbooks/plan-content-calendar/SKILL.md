---
name: plan-content-calendar
title: Plan a month of social media content
description: Given the product, target audience, content pillars and the month's goals, hand back CALENDAR.md with 3 posts per week per channel, each with angle, pillar, format, draft copy, hashtags, image brief and suggested time.
triggers: content calendar, content plan, plan content, plan next month, plan the month, social media plan, posting schedule, editorial calendar, plan posts, content for next month
tags: marketing, social-media, planning, calendar
license: Unspecified
author: QACI Duo
---

# Plan a month of social media content

Turns the brief into a month of posts the team can review in one file. Every item is a real draft that already
follows the brand's facts, formats and voice, so approving the calendar is quick.

## When to use

- "Plan next month's content", "make a posting schedule", or a new product launch that needs a month of posts.
- **Not for:** one post today (`daily-news-post`), publishing a calendar item (`publish-social-post`), or video
  scripts (`write-video-script`).

## Inputs

Ask once, all together. Save the answers to `marketing/BRIEF.md` and reuse them next time; ask only what changed.

| Input | Required | Default |
|---|---|---|
| Product or service | yes | — |
| Target audience (who, where, age, their working day) | yes | — |
| Content pillars and target share (for example 40% knowledge, 30% product, 20% behind the scenes, 10% community) | yes | 4 pillars proposed from the product, equal share, marked as a proposal |
| The month's goals (numbers if any) | yes | "grow engagement", marked as a default |
| Month | no | next calendar month |
| Channels and how each is connected (app, browser, not used) | no | Facebook, Instagram, LinkedIn; Threads and TikTok only if connected |
| Content stage | no | expertise-only (no offers or prices) |
| Time zone | no | from BRIEF.md, else ask |

## Procedure

1. **Read the brand files.** `marketing/BRIEF.md`, `marketing/FACTS.md` (open the `brand-facts` skill if it does not
   exist yet), `marketing/knowledge/INDEX.md`, and `marketing/QUEUE.md` for what was posted recently.
   *Check:* no product, price or customer is used that is not in FACTS.md.
2. **Lay out the slots.** 3 posts per week per channel (for example Mon, Wed, Fri). Threads and TikTok only if they
   are connected (app or browser). Max 1 post per channel per day.
3. **Assign pillars** so the month hits the target share per channel (round to the nearest post; show the planned
   share vs target in the summary).
4. **Assign formats** with the `format-rotation` skill (read its SKILL.md; the exact path is in your Imported skills
   list) using the last 14 days of results, and the rules: `deep-dive` only on Facebook and LinkedIn; **no two posts
   in a row with the same format on one channel**. Without measured data, rotate through the formats and say so.
5. **Draft each item.** For each slot open, in order: `expert-knowledge` (one topic file, the 5-step depth recipe),
   `post-formats` (the format's required parts), `brand-facts` (company facts, `[Owner fills: …]` for gaps),
   `fact-check` (claims with URL and verbatim quote), and `plain-writing` (channel reader and voice). Channel lengths:
   Facebook 80–200 words; Instagram short with hashtags; LinkedIn 150–250 words, max 3 hashtags; Threads ≤500
   characters with 3–4 sourced data points; TikTok/Reels: a one-line idea for `write-video-script`.
   News slots are left as "news slot: filled on the day by `daily-news-post`"; never pre-write news.
6. **Image brief** per item: what the picture shows, text on the image (if any), size for the channel. No real
   customer's face or name unless FACTS.md lists their consent.
7. **Suggested time** per item, in the owner's time zone, from the channel's best hours in the last report; without
   data use 08:00, 12:00 or 20:00 local and say it is a default.
8. **Write `marketing/CALENDAR.md`** (layout below), add every item to `marketing/QUEUE.md` with status `draft` (or
   `blocked` if it has `[Owner fills`), and attach CALENDAR.md with `attach_file`.
9. **Optional export.** If the owner asks and Google Sheets is connected, export the table with
   `GOOGLESHEETS_CREATE_GOOGLE_SHEET1` (a new sheet) and `GOOGLESHEETS_SPREADSHEETS_VALUES_APPEND` (`spreadsheet_id`,
   range, rows). Load them through `COMPOSIO_SEARCH_TOOLS` and take parameter names from the schema it returns. Not
   connected: say so in one sentence and skip.

## Output

```markdown
# Content calendar: <month> (<product>)
Audience: … | Goals: … | Stage: expertise-only | Channels: FB (app), IG (app), LI (browser)
Pillar share planned vs target: knowledge 42%/40%, …
Owner fills needed: <n items> (listed at the end)

## Week 1
| # | Date / time | Channel | Pillar | Format | Topic | Angle |
|---|---|---|---|---|---|---|

### W1-1 Facebook, Mon <date> 12:00, knowledge, landscape
Angle: …
Copy:
<draft>
Hashtags: …
Image brief: …
Claims: claims/<post-id>.json (4 sourced) | Facts used: F02, F05
Format reason: …
```

## Quality checklist

- [ ] 3 posts per week per connected channel; max 1 per channel per day.
- [ ] Pillar share within one post of target per channel.
- [ ] No two consecutive posts with the same format on a channel; `deep-dive` only on FB/LI.
- [ ] Every item has angle, pillar, format, copy, hashtags, image brief, time, claims file.
- [ ] Items with `[Owner fills` are `blocked` and listed.

## Guardrails

**Never**
- Publish, schedule or send anything while planning: the calendar is a draft.
- Promise discounts or prices not in FACTS.md, or include offers while the stage is expertise-only.
- Invent customers, testimonials, metrics or news.

**Ask first**
- Adding a new channel, switching the content stage, anything involving paid ads.

## Example

**Request:** "Plan next month's content for our new coffee subscription, audience: office workers 25–35 in Ho Chi
Minh City."

**Response outline:** Asks once for pillars, goals and channels (defaults offered). Writes CALENDAR.md: 4 weeks ×
3 channels × 3 posts = 36 items, pillar share table, formats rotated with the reason, 8 news slots left for the day,
2 items blocked on `[Owner fills: subscription price]`. Attaches the file and lists what the owner must fill.
