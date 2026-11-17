---
name: rebuttal
title: Write a rebuttal
description: Answer reviewers point by point with evidence, run any extra ablations as separate scripts that never touch the main codebase, and produce a concise rebuttal within the venue's limits.
triggers: write a rebuttal, answer the reviewers, respond to reviews, reviewer asked for an ablation, author response
tags: research, writing, review
license: MIT
author: QACI
---

# Write a rebuttal

Turns a set of reviews into a short, evidence-based response that addresses what moves the scores, with any new experiments isolated from the main code so the submitted results stay intact.

## When to use

- Reviews have arrived and the rebuttal window is open.
- A reviewer asked for an extra experiment or clarification.

## Inputs

| Input | Required | Notes |
|---|---|---|
| All reviews | yes | Full text, including scores and confidence |
| Venue rules | yes | Length limit, format, deadline, whether new results are allowed |
| The submitted paper | yes | To point to existing answers |
| Code, checkpoints and results | yes | For any extra experiment |

## Procedure

1. **Split reviews into points.** One row per point: reviewer, quote, type (question, misunderstanding, requested experiment, presentation issue, disagreement).
2. **Prioritise.** Rank points by their likely effect on the decision: concerns raised by several reviewers and those tied to low scores come first.
3. **Decide the answer type for each point.**
   - already in the paper → point to the section, table or line;
   - needs new evidence → plan an experiment;
   - valid limitation → acknowledge it and say what will change in the final version.
4. **Run extra experiments in isolation.**
   - write new scripts under `rebuttal/`; read existing checkpoints and result files;
   - do not modify the main code or configs;
   - record the command, commit, seeds and runtime for each result.
   - *Check:* the main branch is unchanged after the rebuttal work.
5. **Draft the response.** Courteous and short. Each answer opens with the direct answer, then the evidence. Group answers by theme when several reviewers raise the same issue.
6. **Fit the limits.** Trim to the venue's length; prefer a small table of new results over prose.
7. **Final review.** Every new number has a source; every promise is achievable for the camera-ready; the tone stays neutral even where the reviewer is wrong.

## Output

```markdown
## Rebuttal plan

| # | Reviewer | Point | Priority | Answer type | Evidence |
|---|---|---|---|---|---|

### New experiments
| Experiment | Script | Result | Runtime |
|---|---|---|---|

## Rebuttal draft (<n> / <limit> characters)

**To all reviewers:** <shared concerns and new results>

**R1.** <answer first, then evidence>
**R2.** …
```

## Quality checklist

- [ ] Every high-priority point has an answer.
- [ ] New results come from scripts under `rebuttal/` with recorded commands.
- [ ] The main code and configs are unchanged.
- [ ] The draft is within the length limit.
- [ ] No promise the authors cannot deliver in the final version.

## Guardrails

- **Never:** submit the rebuttal; the authors post it.
- **Never:** argue emotionally or question a reviewer's competence.
- **Never:** reveal author identity in a double-blind process (names, institution, non-anonymous links).
- **Ask first:** before running experiments beyond the agreed compute budget.

## Example

**Request:** "R2 says our gains might come from more parameters. Help me answer and run what's needed."

**Response outline:** points table with R2's concern ranked first, a parameter-matched baseline run via `rebuttal/param_matched.py` on existing data with three seeds, a two-row results table, and a 120-word answer that leads with the parameter-matched result.
