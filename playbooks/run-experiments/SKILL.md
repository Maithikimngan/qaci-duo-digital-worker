---
name: run-experiments
title: Design and run experiments
description: Build a leak-free data pipeline, reproduce baselines, design ablations with several seeds, read training logs, and analyse failure cases so the results can be trusted and reported.
triggers: run experiments, set up baselines, design an ablation, read my training logs, analyse failure cases, why does my model fail
tags: research, experiments, evaluation
license: MIT
author: QACI
---

# Design and run experiments

Produces results that survive review: fixed splits, honest baselines, ablations that isolate each component, multiple seeds, and an error analysis that explains where the method fails.

## When to use

- A prototype works and the paper's experiments must be designed and run.
- Results are noisy, surprising, or contradict expectations.
- **Not for:** first implementation of an idea (use `idea-to-prototype`).

## Inputs

| Input | Required | Notes |
|---|---|---|
| The question each experiment answers | yes | One question per experiment |
| Data and current splits | yes | Where they live and how they were made |
| Method and config | yes | The prototype to evaluate |
| Compute budget | yes | GPU hours available; drives how many seeds and runs |
| Published baselines | no | Papers and numbers to compare with |

## Procedure

1. **Write the experiment table first.** One row per run: question, what changes, what stays fixed, metric, seeds, config file, expected duration.
   - *Check:* every run answers a question; drop runs that do not.
2. **Lock the data.** Create the splits once, save them (IDs, not just a seed) and record their hash.
   - Check for leakage: duplicates across splits, the same patient or user in train and test, test data used for tuning.
   - Report the label distribution per split.
   - *Check:* a script asserts the splits are disjoint at the right level.
3. **Baselines.** Include at least one simple baseline (majority class, linear model or a standard architecture) and one strong published baseline.
   - Reproduce the published baseline's reported number in its own setting before comparing in yours; report both.
4. **Ablations.** Remove or replace one component at a time. Use at least three seeds per configuration; report mean ± standard deviation.
5. **Run and record.** For every run store the commit, config, seed, start time and output path. Keep a results file that the tables are built from.
6. **Read the logs.** Check training and validation loss, learning rate, gradient norm, NaN or Inf, overfitting, and spread across seeds. Cite the step numbers where things happen.
7. **Analyse failures.** Sample wrong predictions by group (class, length, data source, site). Look for a shared pattern, state a hypothesis, and propose the experiment that would test it.
8. **Report.** Build tables from the results file only, and state which differences are within seed noise.

## Output

```markdown
## Experiment report: <question>

<Three sentences: the main result, how robust it is, the most important failure mode.>

### Setup
Data and splits (hash), metric, seeds, compute used.

### Results
| Method | Metric (mean ± std, n seeds) | Δ vs. baseline | Commit / config |
|---|---|---|---|

### Ablations
| Variant | Metric | Δ | Reading |
|---|---|---|---|

### Training-log notes
- <observation> (step …, run …)

### Failure analysis
| Group | Error rate | Example IDs | Hypothesis |
|---|---|---|---|

### Next experiments
```

## Quality checklist

- [ ] Splits are saved, hashed and leak-checked.
- [ ] Every number in a table traces to a run with commit, config and seed.
- [ ] Differences smaller than seed noise are called out.
- [ ] The test set was never used to choose a checkpoint, seed or hyperparameter.

## Guardrails

- **Never:** select seeds, checkpoints or hyperparameters on the test set.
- **Never:** report an estimate or an unfinished run as a result.
- **Never:** modify the test set after seeing results.
- **Ask first:** before launching runs beyond the agreed compute budget.

## Example

**Request:** "My method beats the baseline by 1.2 AUROC. Make it paper-ready."

**Response outline:** experiment table, patient-level split check, reproduced baseline number, three-seed results showing the gain is 1.2 ± 0.4, ablation of each component, log notes on a late-training divergence in one seed, failure analysis by recording site.
