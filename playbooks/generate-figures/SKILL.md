---
name: generate-figures
title: Make figures for a paper
description: Build paper figures from raw results and the researcher's own insight, compare two alternative designs before choosing, and keep a script that redraws every figure when the numbers change.
triggers: make a figure, plot these results, figure for the paper, improve this chart, visualise the results
tags: research, writing, figures
license: MIT
author: QACI
---

# Make figures for a paper

A good figure carries one message the reader gets in five seconds. This playbook starts from that message, draws from raw result files, tries two designs, and leaves a script so the figure can be regenerated.

## When to use

- Results exist and need figures for a paper, poster or talk.
- An existing figure is cluttered, misleading or hard to read in print.
- **Not for:** writing the surrounding text (use `paper-writing-pipeline`).

## Inputs

| Input | Required | Notes |
|---|---|---|
| Raw results | yes | CSV, JSON or logs, not numbers typed into chat |
| The message | yes | One sentence in the researcher's words: what should the reader see? |
| Venue template | no | Column width, fonts, page limits. Default: two-column conference format |
| Existing style | no | Colours or figures already in the paper to stay consistent with |

## Procedure

1. **Write the message first.** Ask for the insight in the researcher's words and write it above the figure plan. The figure exists to support that sentence.
   - *Check:* the message is a claim ("A beats B at low data"), not a topic ("results").
2. **Load raw data.** Read the result files directly. Cross-check two or three values against the paper's tables.
   - *Check:* any mismatch with the tables is reported, not silently fixed.
3. **Choose the chart type.**
   - comparison of a few methods → bar or dot plot;
   - trend over a variable → line plot;
   - distribution → box, violin or histogram;
   - relationship → scatter, with a fit only when justified.
   - With several seeds, show error bars or intervals and say which (std, 95% CI).
4. **Draw two alternatives.** For example two layouts, two encodings, or two agents drawing the same figure from the same data. Compare them on: does it deliver the message, does it survive black-and-white printing, does it fit a single or double column, do fonts match the paper.
5. **Finish the chosen one.**
   - vector output (PDF or SVG);
   - text no smaller than the caption font at final size;
   - a colour-blind-safe palette, with markers or line styles as a second cue;
   - axis labels with units; the y-axis starting at zero for bars;
   - consistent method names and colours across all figures.
6. **Write the caption.** First sentence states the message; the rest says what is plotted, the error-bar meaning and the number of seeds.
7. **Save the script** next to the data, with one command that regenerates every figure.

## Output

```markdown
## Figure: <message>

![figure](figures/<name>.pdf)

**Caption draft:** <message sentence>. <What is shown; error bars = …; n = … seeds.>

### Why this design
Option A: … Option B: … Chosen: … because ….

### Reproduce
`python plot_<name>.py --results results/<file>` → figures/<name>.pdf

### Data checks
Values cross-checked against Table …: match / mismatch (…).
```

## Quality checklist

- [ ] The figure supports a one-sentence message stated in the caption.
- [ ] Every plotted value comes from a result file, not from chat.
- [ ] Readable at final size and in greyscale.
- [ ] Error bars are defined in the caption.
- [ ] One command regenerates the figure.

## Guardrails

- **Never:** make results look better than they are: no truncated axes that exaggerate gaps, no dropping bad seeds, no cherry-picked subsets without saying so.
- **Never:** plot numbers without a source file.
- **Ask first:** before changing the method names, colours or ordering already used elsewhere in the paper.

## Example

**Request:** "Plot accuracy vs. labelled-data fraction for our method and three baselines; I want to show we win in the low-data regime."

**Response outline:** message sentence, line plot on a log x-axis with shaded 95% intervals over five seeds versus a grouped bar alternative, line plot chosen, caption draft, regenerate command, note that the 1% point for one baseline differs from Table 3.
