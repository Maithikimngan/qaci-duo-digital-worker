---
name: mentor-outreach
title: Shortlist mentors and polish the application
description: Filter potential mentors against the applicant's CV and direction, then draft and polish cold emails, the statement of purpose and the CV for each target while keeping the applicant's own voice.
triggers: cold email a professor, write to a supervisor, statement of purpose, SoP, polish my CV, application email
tags: research, phd, application, writing
license: MIT
author: QACI
---

# Shortlist mentors and polish the application

Helps an applicant contact the right people with short, specific, honest messages, and bring the statement and CV to the standard each target expects — without replacing the applicant's voice with template prose.

## When to use

- A list of potential mentors exists (for example from `find-supervisors`) and outreach is next.
- The statement of purpose or CV needs work for specific programmes.
- **Not for:** a final outsider read of the finished package (use `application-review`).

## Inputs

| Input | Required | Notes |
|---|---|---|
| CV | yes | Current version |
| Candidate mentors | yes | Names with links, ideally with the papers that make them a fit |
| Statement draft | no | Needed for statement work |
| Programme requirements | no | Length, prompts, deadlines per programme |
| Samples of the applicant's writing | no | Emails or paragraphs, to match their voice |

## Procedure

1. **Filter mentors.** Compare the applicant's experience and direction with each mentor's recent work. Keep those with a concrete connection — a paper the applicant can discuss, a method they have used, a dataset they know. Note the connection.
2. **Draft one email per mentor.**
   - subject line that states the purpose (for example "Prospective PhD student — <topic>");
   - one sentence on who the applicant is;
   - one or two sentences linking to a specific paper of the mentor that the applicant has actually read, and why it relates to their work;
   - the ask: openings, fit, a short call;
   - CV attached; under 200 words; no flattery.
   - *Check:* the email would make no sense if sent to a different person.
3. **Statement of purpose.** Build it from the applicant's real story: motivation, research experience and what they personally did, results, the direction they want next, and why this programme or lab. Match the programme's length and prompts.
4. **CV.** Research experience and publications first; each item starts with a verb and states a result; consistent date and citation formats; nothing padded.
5. **Edit for voice.** Fix grammar and clarity but keep the applicant's phrasing. Flag sentences that read as machine-written so the applicant rewrites them in their own words.
6. **Track.** Produce a table of who gets which email and what each one references.

## Output

```markdown
## Outreach package

### Mentor shortlist
| Mentor | Connection (paper, method, data) | Priority |
|---|---|---|

### Emails
**To <name> — subject: <subject>**
<draft, under 200 words>

### Statement of purpose
<revised draft with tracked comments>

### CV
<revised sections with comments>

### Sentences to rewrite in your own words
- "<sentence>" — why it reads as generic
```

## Quality checklist

- [ ] Each email references a specific paper and could only go to that person.
- [ ] Every claim in the email, statement and CV is true and verifiable.
- [ ] Length limits are met.
- [ ] Machine-sounding sentences are flagged, not silently kept.

## Guardrails

- **Never:** send emails or submit applications; the applicant does.
- **Never:** exaggerate achievements, invent experience or claim to have read a paper the applicant has not.
- **Never:** write the whole statement in place of the applicant; draft from their material and leave decisions to them.
- **Ask first:** before contacting anyone or sharing the applicant's documents outside the conversation.

## Example

**Request:** "Here's my CV and five professors from the shortlist. Draft emails and fix my SoP for two programmes."

**Response outline:** four mentors kept (one dropped for lack of a real connection), four tailored emails of 140–180 words, SoP revised for each programme's prompt with comments, CV reordered with results-first bullets, six sentences flagged for the applicant to rewrite.
