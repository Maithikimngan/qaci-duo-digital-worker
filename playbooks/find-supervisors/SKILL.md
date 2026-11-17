---
name: find-supervisors
title: Find suitable supervisors
description: Find professors or labs that fit a research direction, from either a short description or a CV and research statement, with recent papers as evidence and a dated check of whether each is taking students.
triggers: find a supervisor, find a PhD advisor, which labs fit me, find professors, PhD application, where should I apply
tags: research, phd, application
license: MIT
author: QACI
---

# Find suitable supervisors

Builds a shortlist of potential supervisors where every match is backed by the person's recent work, and every fact about availability carries the date it was checked.

## When to use

- Preparing PhD, master's or research-internship applications.
- Looking for a lab to collaborate with.
- **Not for:** writing emails or statements (use `mentor-outreach`).

## Inputs

Two modes; ask which one the user wants.

| Mode | Input | Trade-off |
|---|---|---|
| Prompt only | A few sentences on the research direction | Fast and broad; matches are by topic only |
| CV and statement | CV plus research statement or a draft | Slower, more precise; matches against real experience |

Also ask: countries or universities preferred or excluded, intake term, funding needs, and any language or visa constraints.

## Procedure

1. **Extract the profile.** From the input, list 3–5 core topics, the methods the user knows, the data they have worked with, and keywords. Confirm the list with the user.
2. **Find people through their work.**
   - authors of papers from the last 2–3 years on those topics at well-regarded venues;
   - lab pages and department faculty lists;
   - co-authors of the strongest matches.
3. **Check each candidate.**
   - recent papers (last two years) and their direction;
   - whether they are recruiting (lab page, "prospective students" page, recent announcements) and the date checked;
   - current students and group size where visible;
   - funding signals (grants, positions advertised).
4. **Score the fit** 1–5 on topic, methods, data and practical constraints (location, intake, funding), with one line per score and 1–2 papers as evidence.
5. **Rank and tier.** Group into *strong match*, *good match* and *stretch*, aiming for 10–20 candidates overall.
6. **Flag uncertainty.** Mark anything not confirmed on an official page.

## Output

```markdown
## Supervisor shortlist: <direction> (checked <date>)

<Two sentences: how many candidates, where the strongest matches are.>

| Tier | Name | University / lab | Link | Matching papers | Why it fits | Recruiting? (source, date) |
|---|---|---|---|---|---|---|

### Profile used
Topics: … Methods: … Data: …

### Not confirmed
- <items that need checking on an official page>
```

## Quality checklist

- [ ] Every candidate has an official page link and at least one recent matching paper.
- [ ] Recruiting status cites a source and a date, or says "unknown".
- [ ] Fit reasons are specific to the person's work, not generic.

## Guardrails

- **Never:** invent people, affiliations, papers or recruiting status.
- **Never:** guess email addresses; link to the official page instead.
- **Ask first:** before widening the search beyond the user's stated countries or constraints.

## Example

**Request:** "I've worked on ECG deep learning and want a PhD in trustworthy medical AI in Europe, starting next autumn."

**Response outline:** confirmed profile, 14 candidates in three tiers with two recent papers each, recruiting status with dates (five confirmed, nine unknown), and a list of facts to verify on official pages.
