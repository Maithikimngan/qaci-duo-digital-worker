---
name: publish-social-post
title: Draft, approve and publish a social post
description: Turn one calendar item into final copy per channel with its claims, show the owner a preview, and publish only the exact text the owner approved, through the channel's app or the browser, at most one post per channel per day.
triggers: publish, publish the post, post it, schedule a post, schedule the post, publish on facebook, post on instagram, post on linkedin, draft and schedule, publish tuesdays post, publish approved posts
tags: marketing, social-media, publishing, approval
license: Unspecified
author: QACI Duo
---

# Draft, approve and publish a social post

The only skill that publishes. It turns a calendar item into final copy for each channel, gets the owner's approval
on the exact text, and posts that text unchanged.

## When to use

- "Publish Tuesday's post on Facebook and Instagram", "schedule this", or the routine that publishes approved,
  due posts.
- **Not for:** planning (`plan-content-calendar`), today's news post draft (`daily-news-post`), replies
  (`triage-comments`).

## Inputs

| Input | Required | Default |
|---|---|---|
| The calendar item or draft (`marketing/drafts/<post-id>.md`) | yes | — |
| Channels | no | the item's channel |
| Time | no | the item's suggested time |
| Media file(s) | no | none; for Instagram an image is required |

## Before you start: app access

Each channel posts through its app if connected, else through the browser (`browser-posting`), else not at all.
- No app tools at all in your turn: tell the owner in one sentence to turn on app access (Settings of this bot →
  Apps) and connect the channel's app, or allow browser posting for it; then stop.
- Load the tools once: tool search for `COMPOSIO_SEARCH_TOOLS` and `COMPOSIO_MULTI_EXECUTE_TOOL`, call
  `COMPOSIO_SEARCH_TOOLS` for the toolkits below, then run them with `COMPOSIO_MULTI_EXECUTE_TOOL`. Take parameter
  names from the schema it returns; never guess them.

| Need | Tool |
|---|---|
| Facebook Page id | `FACEBOOK_LIST_MANAGED_PAGES` (save the id in BRIEF.md) |
| Facebook text post | `FACEBOOK_CREATE_POST` (page id, message) |
| Facebook photo post | `FACEBOOK_CREATE_PHOTO_POST` (page id, photo, message) |
| Instagram account id | `INSTAGRAM_GET_USER_INFO` |
| Instagram post, step 1 | `INSTAGRAM_CREATE_MEDIA_CONTAINER` (ig user id, public image URL, caption) |
| Instagram post, step 2 | `INSTAGRAM_GET_POST_STATUS` until finished, then `INSTAGRAM_CREATE_POST` (ig user id, container id) |
| LinkedIn author | `LINKEDIN_GET_MY_INFO` |
| LinkedIn post | `LINKEDIN_CREATE_LINKED_IN_POST` (author, text, visibility); not connected: `browser-posting` |
| Threads post (optional) | `THREADS_CREATE_AND_SHARE_POST` (text) |
| TikTok video to drafts (optional) | `TIKTOK_UPLOAD_VIDEO`, then `TIKTOK_FETCH_PUBLISH_STATUS` |

## Procedure

1. **Final copy per channel.** From the draft, write each channel's version and run `plain-writing` on it:

   | Channel | Length and form |
   |---|---|
   | Facebook | long, 80–200 words |
   | Instagram | short caption + hashtags (5–15); image required |
   | LinkedIn | professional, 150–250 words, max 3 hashtags |
   | Threads | ≤500 characters, 3–4 sourced data points, no signature |

   *Check:* `[Owner fills` is not in any version; every claim is in `marketing/claims/<post-id>.json` (run
   `fact-check` if not).
2. **Limits.** Max 1 post per channel per day (count published and approved items in `marketing/QUEUE.md`). Channel
   paused in `marketing/LOG.md`: do not post; say until when.
3. **Preview and approval.** Show the owner, per channel: the exact text, the media, the time, and the claims
   (claim, url, quote). Ask with the ask-user tool: "Approve this exact text for <channel> at <time>?" Options:
   Approve / Change / Skip. Silence is not approval.
4. **Freeze the approved text.** On Approve, save the exact text to `marketing/approved/<post-id>-<channel>.md` and
   set the queue row to `approved` with the approval time. That file is never edited. A change request makes a new
   draft and a new approval.
5. **Publish at the time.**
   - Approved before the time: publish at the time (the publish routine checks the queue).
   - **Approved after the time: publish at approval time**, never drop it, as long as the 1-per-day limit holds;
     otherwise move it to the next free day and tell the owner.
   - Use the channel's tool from the table, with the text read from the approved file. Browser channels: follow
     `browser-posting`.
   *Check:* the text sent equals the approved file exactly.
6. **Record.** Save the post id or link, the time, and the channel to `marketing/QUEUE.md` (`published`). A failed
   call: status `failed` with the exact error; do not retry more than once; tell the owner.

## Output

```markdown
| Channel | Post id | Status | Time | Link / error |
|---|---|---|---|---|
| facebook | 2026-11-25-fb-1 | published | 12:00 | <link> |
| linkedin | 2026-11-25-li-1 | awaiting-approval | 12:00 | — |
```

## Quality checklist

- [ ] The owner approved the exact text per channel before posting.
- [ ] The text posted equals `approved/<post-id>-<channel>.md`.
- [ ] Max 1 post per channel per day; paused channels skipped.
- [ ] Late approvals posted at approval time.
- [ ] Every result recorded in QUEUE.md, with exact errors for failures.

## Guardrails

**Never**
- Publish without the owner's approval of the exact text, or publish a post with `[Owner fills` or unsourced claims.
- Edit an approved post's text, before or after publishing.
- Delete a post, boost a post or spend ad money.

**Ask first**
- Every publish, deleting anything, anything touching Meta Ads, adding a new channel.

## Example

**Request:** "Publish Tuesday's post on Facebook and Instagram."

**Response outline:** Finds W2-2 in CALENDAR.md. Facebook version 164 words, Instagram caption + 9 hashtags with the
image. Preview with claims; approval card. Owner approves at 14:10 for a 12:00 slot, so both go out at 14:10.
Facebook post via `FACEBOOK_CREATE_PHOTO_POST`, Instagram via container then publish. Links saved in QUEUE.md.
