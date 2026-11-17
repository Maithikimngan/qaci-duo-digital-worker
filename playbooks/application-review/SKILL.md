---
name: application-review
title: Review an application as a PI would
description: Read an application the way a busy PI does, spot what signals generic or AI-polished writing and what gets an application skipped, and recommend the few changes that matter most.
triggers: review my application, how will a professor read this, does this sound AI-written, check my SoP, application feedback
tags: research, phd, application, review
license: MIT
author: QACI
---

# Review an application as a PI would

Gives the applicant an outsider's read before anything is sent: what a supervisor notices in the first 30 seconds, which sentences sound generic or machine-polished, and which claims lack evidence.

## When to use

- Before sending cold emails or submitting an application.
- After heavy AI-assisted editing, to check the result still sounds like the applicant.
- **Not for:** drafting the documents (use `mentor-outreach`).

## Inputs

| Input | Required | Notes |
|---|---|---|
| The documents to review | yes | Email, statement, CV, research proposal |
| The recipient | yes | The PI or programme, with a link to their page |
| What the applicant wants to convey | no | Their key message, to check it comes through |

## Procedure

1. **The 30-second read.** Read as a busy PI skimming dozens of messages. Can you tell, from the first lines, what the applicant has done, what they are good at, and why they fit this lab? Write down what you remember after one pass.
2. **Signals of generic or AI-polished writing.** Look for:
   - praise of the lab that would fit any lab;
   - stock phrases and inflated adjectives;
   - uniform sentence length and rhythm; lists of three everywhere;
   - no detail that only someone who did the work would know;
   - a paper of the PI mentioned incorrectly or superficially.
   Quote each instance.
3. **Evidence check.** For each claimed skill or result, is there a paper, repository, number or reference behind it?
4. **Fit check.** Is the stated connection to the lab specific and accurate against the PI's recent work?
5. **Machine-reader check.** Many PIs and programmes now use AI tools to sort and summarise applications. Make sure the key facts (topic, strongest result, fit) appear early, plainly, with the right keywords.
6. **Prioritise.** Recommend the three changes with the biggest effect, then the rest.

## Output

```markdown
## Application review: <applicant> → <recipient>

**30-second impression:** <what a PI would remember>
**Top three changes:**
1. …
2. …
3. …

### By document
**Email** — strengths …; issues … (quoted)
**Statement** — …
**CV** — …

### Sentences to rewrite
| Quote | Why it hurts | Direction for the rewrite |
|---|---|---|

### Claims without evidence
- …
```

## Quality checklist

- [ ] Feedback quotes the exact sentences it refers to.
- [ ] The three top changes are specific and actionable.
- [ ] The fit check was made against the PI's actual recent work.

## Guardrails

- **Never:** promise admission outcomes or estimate acceptance chances.
- **Never:** rewrite the whole application for the applicant; give direction and let them write.
- **Ask first:** before sharing the documents with anyone else.

## Example

**Request:** "Read my email to Prof. X the way they would. Does it sound like ChatGPT?"

**Response outline:** 30-second impression ("ECG student, interested in robustness, fit unclear"), three changes (lead with the PTB-XL result, replace the generic lab praise with the specific shift paper, cut to 150 words), four quoted sentences flagged as generic with rewrite directions.
