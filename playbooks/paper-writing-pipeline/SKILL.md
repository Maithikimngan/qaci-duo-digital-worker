---
name: paper-writing-pipeline
title: Write a paper in LaTeX, end to end
description: Set up a LaTeX writing pipeline from outline to full draft, keep the authors' voice, run consistency checks, and verify every number and implementation detail in the paper against the code and result files.
triggers: write the paper, set up LaTeX, paper outline, consistency check, does the paper match the code, prepare for reviewers
tags: research, writing, latex
license: MIT
author: QACI
---

# Write a paper in LaTeX, end to end

Takes the authors from notes and results to a consistent draft whose every number can be traced to a result file and commit, written in their voice rather than generic prose.

## When to use

- Starting a paper, or restructuring a draft.
- Before submission, to catch inconsistencies and paper–code mismatches.
- **Not for:** figures (use `generate-figures`) or answering reviews (use `rebuttal`).

## Inputs

| Input | Required | Notes |
|---|---|---|
| Target venue | yes | Template, page limit, anonymity rules |
| Notes, results and figures | yes | Whatever exists; gaps become TODOs |
| The code repository and result files | yes | For paper–code verification |
| The authors' own writing | no | Earlier papers or paragraphs, to match their voice |

## Procedure

1. **Set up the project.**
   - the venue's official template; folders `sections/`, `figures/`, `tables/`;
   - macros for the method name and for numbers repeated across sections;
   - BibTeX entries from official sources (DBLP, the publisher, the venue), never typed from memory;
   - a build command that compiles without warnings.
2. **Outline.** One paragraph per section stating its point. Write the contributions as bullets, each pointing to the experiment or section that supports it.
   - *Check:* the authors approve the contributions before drafting.
3. **Draft in the authors' voice.** Build each section from their notes and sentences. Where evidence is missing, insert `\todo{...}` with what is needed instead of inventing it.
4. **Consistency pass.**
   - terminology and notation identical everywhere; symbols defined before use;
   - dataset, metric and method names consistent with tables and figures;
   - numbers in abstract, introduction, tables and conclusion agree;
   - every figure, table and section reference resolves; every citation exists in the `.bib`;
   - claims in the introduction are each backed by a result.
5. **Paper–code verification.**
   - every number in a table traces to a result file and a commit;
   - every implementation detail (learning rate, batch size, epochs, architecture, preprocessing, splits) matches the config actually used;
   - list mismatches with both values and their sources.
6. **Reviewer defence.** List the 5–10 questions reviewers are most likely to ask and where the paper answers each; mark the unanswered ones.
7. **Final checks.** Page limit, anonymity (no names, acknowledgements or identifying links in a blind submission), supplementary material references.

## Output

```markdown
## Paper status: <title>

**Compiles:** yes/no. **Pages:** x / limit. **Open TODOs:** n.

### Contributions → evidence
| Contribution | Supported by |
|---|---|

### Consistency issues
| Location | Issue | Suggested fix |
|---|---|---|

### Paper vs. code
| Paper says | Code / results say | Source | Action |
|---|---|---|---|

### Likely reviewer questions
| Question | Answered where | Gap |
|---|---|---|
```

## Quality checklist

- [ ] The draft compiles cleanly.
- [ ] Every table number traces to a result file and commit.
- [ ] Every citation key comes from an official source.
- [ ] No contribution is claimed that the authors have not approved.
- [ ] Anonymity rules are respected for blind review.

## Guardrails

- **Never:** invent citations, results or implementation details.
- **Never:** add a contribution or claim the authors have not confirmed.
- **Never:** submit the paper; submission is the authors' action.
- **Ask first:** before rewriting a section the authors wrote themselves, beyond small fixes.

## Example

**Request:** "Here's our results folder and notes for a workshop paper on ECG pretraining. Set up the paper and check it against the code."

**Response outline:** template project with macros, outline with four contributions mapped to experiments, drafted method section with two TODOs, consistency report (two metric-name mismatches), paper–code table showing the paper says 50 epochs while the config ran 40, eight likely reviewer questions.
