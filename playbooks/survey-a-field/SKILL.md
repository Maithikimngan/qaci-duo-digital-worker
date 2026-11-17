---
name: survey-a-field
title: Survey a research field
description: Map a research field into approaches with representative papers, close-read the key ones, and check whether the user's idea overlaps prior work, separating verified facts from model recall.
triggers: survey a field, literature review, related work, map the literature, has anyone done this, read these papers
tags: research, literature
license: MIT
author: QACI
---

# Survey a research field

Turns a topic or research question into a sourced map of the field: the main approaches, the papers that define them, what is solved, what is open, and how close the user's idea sits to existing work.

## When to use

- Starting a new direction and needing the lay of the land.
- Writing or refreshing a related-work section.
- Checking whether an idea has already been published.
- **Not for:** deciding between candidate ideas (use `validate-idea`) or learning an unfamiliar data domain (use `learn-domain-knowledge`).

## Inputs

| Input | Required | Notes |
|---|---|---|
| Topic or research question | yes | One or two sentences; the more specific, the better the map |
| The user's idea, if any | no | Needed for the overlap check |
| Seed papers | no | Titles or links the user already trusts |
| Scope | no | Venues, years, subfields to include or exclude. Default: last five years, all major venues |

## Procedure

1. **Frame the search.** Rewrite the question into 3–6 queries: core terms, synonyms, task names, benchmark and dataset names, and the names of well-known methods.
   - *Check:* each query targets a different angle; record every query used.
2. **Collect candidates.** Search Google Scholar, Semantic Scholar, arXiv, OpenReview and the venues' proceedings. Follow references and citations of seed papers one hop in each direction.
   - Keep only papers you could open. Note for each: title, authors, year, venue, link.
   - *Check:* 20–60 candidates for a broad field, fewer for a narrow one.
3. **Cluster into approaches.** Group candidates into 3–6 approaches by the core idea, not by keyword. Name each approach in plain words.
   - For each approach pick 2–5 representative papers: the origin, the strongest current result, and a notable variant.
   - *Check:* every representative paper fits exactly one approach; borderline papers are noted as such.
4. **Close-read the key papers.** For the 3–5 papers that matter most, read the method, the main results table and the limitations section — not only the abstract.
   - Record numbers with their table or page (for example "Table 2, p. 6").
   - Record the evaluation setup: dataset, split, metric, baselines.
   - *Check:* no number is quoted without its location.
5. **Find what is open.** From limitations sections, failure cases and disagreements between papers, list the open problems and where results conflict.
6. **Check overlap with the user's idea** (when one is given). Compare the idea with the closest 3–5 papers on four axes: problem, method, data, evaluation.
   - Verdict: *no overlap found*, *partial overlap*, or *already done*, with the closest paper named.
   - *Check:* "no overlap found" lists where and how you searched.
7. **Label confidence.** Mark every claim **verified** (read in the paper, location given) or **to re-check** (from an abstract, a blog post, or model recall).

## Output

```markdown
## Field map: <topic>

<Three sentences: the main approaches, the current best results, the biggest open problem.>

### Approaches
| Approach | Core idea | Representative papers (year, venue) | Strength | Known limitation |
|---|---|---|---|---|

### Key papers, close-read
- **<Title>** (<venue year>, <link>) — problem, method, headline result (Table X), limitation stated by the authors.

### Open problems
- <Problem> — evidence: <paper, location>.

### Overlap with your idea
Verdict: <no overlap found / partial / already done>. Closest work: <paper>. Same: … Different: …

### Searches run
<queries and sources>

### To re-check
- <claims marked "to re-check">
```

## Quality checklist

- [ ] Every paper listed has a link that opens.
- [ ] Every number cites its table or page.
- [ ] The overlap verdict names the closest paper and the concrete differences.
- [ ] Claims from abstracts or memory are marked "to re-check".

## Guardrails

- **Never:** invent a paper, author, venue, number or DOI. If a paper cannot be found or opened, say so.
- **Never:** conclude "nobody has done this" from a failed search; report the searches instead.
- **Ask first:** before spending a long session on a very broad field, confirm the scope.

## Example

**Request:** "Survey self-supervised pretraining for 12-lead ECG classification and tell me if contrastive learning across leads has been done."

**Response outline:** field map with approaches (contrastive, masked reconstruction, multimodal with reports), close-read of four papers with their PTB-XL numbers, open problems (label scarcity, cross-hospital shift), overlap verdict naming the closest cross-lead contrastive paper, list of queries, items to re-check.
