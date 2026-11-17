---
name: validate-idea
title: Validate an idea and choose a direction
description: Stress-test a research idea for strengths, weaknesses and novelty, compare candidate solutions, and recommend one direction with the smallest experiment that would prove it right or wrong.
triggers: validate my idea, is this idea novel, novelty check, choose a research direction, which idea should I pursue, poke holes in this idea
tags: research, ideation
license: MIT
author: QACI
---

# Validate an idea and choose a direction

Helps a researcher decide whether an idea deserves weeks of work, by turning it into a testable hypothesis, comparing alternatives honestly and naming the cheapest experiment that settles it.

## When to use

- The user has one idea and wants it challenged before investing time.
- The user has several directions and needs to pick one.
- A supervisor or reviewer asked "what is new here?".
- **Not for:** a full literature map (use `survey-a-field` first if none exists).

## Inputs

| Input | Required | Notes |
|---|---|---|
| The idea, in the user's words | yes | Even a rough paragraph |
| Constraints | yes | Data available, compute, deadline, target venue |
| Related work already known | no | Papers the user considers closest |
| Alternatives being considered | no | Other ideas to compare against |

## Procedure

1. **State the hypothesis.** Rewrite the idea as "If we do X, then Y improves by Z on data D, measured by M." If it cannot be written this way, ask what would count as success.
   - *Check:* the user agrees with the hypothesis wording.
2. **Find the closest work.** Identify the 5–10 nearest papers; run `survey-a-field` first if the field is unfamiliar.
3. **Strengths and weaknesses.** Assess the idea on contribution, technical risk, data availability, compute, time to first result, and how convincing the evaluation can be.
4. **Generate candidate solutions.** Propose 2–4 concrete ways to realise the idea, including at least one simpler alternative a reviewer would suggest.
   - For each: core mechanism, cost, main risk, baselines it must beat.
5. **Novelty check.** For each candidate, name the closest paper and the specific difference. Then argue the reviewer's side: "isn't this just A plus B?", "would a stronger baseline close the gap?".
   - *Check:* every "novel" claim names the paper it differs from.
6. **Score and choose.** Score candidates 1–5 on novelty, feasibility, expected impact and cost, with one line of justification per score. Recommend one.
7. **Design the smallest decisive experiment.** At most one week of work, with a stop criterion fixed in advance: what result means "continue", "pivot" or "stop".

## Output

```markdown
## Idea check: <short name>

**Hypothesis:** If …, then … on …, measured by ….
**Recommendation:** <candidate> — <one-sentence reason>.

### Closest work
| Paper | What it does | How the idea differs |
|---|---|---|

### Strengths / weaknesses
### Candidates
| Candidate | Novelty | Feasibility | Impact | Cost | Notes |
|---|---|---|---|---|---|

### Reviewer's objections and answers
### First experiment
- Setup: …
- Baselines: …
- Continue if …; pivot if …; stop if ….
- Time and compute: …

### Your decisions
```

## Quality checklist

- [ ] The hypothesis is falsifiable and measurable.
- [ ] At least one simpler alternative was considered.
- [ ] The stop criterion is fixed before the experiment runs.
- [ ] Scores have a reason each, not just a number.

## Guardrails

- **Never:** call an idea novel without naming the closest paper.
- **Never:** present the recommendation as the decision; the researcher decides.
- **Ask first:** before running any experiment as part of this playbook.

## Example

**Request:** "I want to use LLM-generated rationales to improve small-model ECG report classification. Worth it?"

**Response outline:** hypothesis with a target metric, closest distillation-with-rationales papers, three candidates (rationale distillation, rationale as auxiliary target, plain data augmentation as the simple baseline), scores, a one-week experiment on a public dataset with a clear stop rule.
