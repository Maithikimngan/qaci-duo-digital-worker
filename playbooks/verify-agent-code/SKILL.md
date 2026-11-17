---
name: verify-agent-code
title: Verify code written by an agent
description: Review and test code an AI agent wrote before trusting its results, focusing on the silent bugs that change numbers without crashing, and give a clear verdict on whether the results can be used.
triggers: verify this code, review agent-written code, can I trust these results, check the AI's code, audit this diff
tags: research, verification, code-review
license: MIT
author: QACI
---

# Verify code written by an agent

Agents write plausible code fast, and their summaries can overstate what was tested. This playbook checks the actual diff and runs targeted tests, so experiment numbers rest on code someone verified.

## When to use

- An agent wrote or changed training, data or evaluation code.
- Results changed unexpectedly after an agent's edit.
- Before numbers from agent-written code go into a paper or a decision.

## Inputs

| Input | Required | Notes |
|---|---|---|
| The diff, branch or commit range | yes | The real change, not the agent's summary |
| What the change was meant to do | yes | The task given to the agent |
| How to run it | yes | Commands for tests, a small training run and evaluation |
| Reference implementation | no | Paper code or a trusted earlier version |

## Procedure

1. **Read the real diff.** List every file and function changed. Compare against the stated intent; flag changes that the task did not ask for.
2. **Hunt silent bugs.** Go through this list for every changed path:
   - data leakage between splits; normalisation statistics computed on all data;
   - wrong axis, broadcasting or reshape; off-by-one in windows or sequences;
   - `model.eval()` / `torch.no_grad()` missing at evaluation; dropout or batch-norm in the wrong mode;
   - masks inverted or misaligned; padding counted in the loss or metric;
   - seeds not set or not propagated to data loaders;
   - metric averaging (micro vs. macro), thresholding on the test set;
   - the wrong config file or a hard-coded default overriding the config;
   - exceptions caught and ignored; fallbacks that silently skip data.
3. **Test by running.**
   - inputs with a known answer through each new function;
   - compare outputs with the reference implementation on the same batch;
   - feature switched off must reproduce the previous result exactly.
4. **Check reproducibility.** Run twice with the same seed and compare. Record commit, config, library versions and hardware.
5. **Classify findings.** *Blocking* (changes results), *should fix*, *note*. Each finding has file:line, why it matters, and how it was confirmed.
6. **Verdict.** State whether the results produced by this code can be used, cannot be used, or can be used after specific fixes.

## Output

```markdown
## Verification: <change>

**Verdict:** <usable / not usable / usable after fixes>. <One sentence why.>

### Scope
Files and functions changed; changes beyond the task: ….

### Findings
| Severity | Location | Problem | How confirmed | Fix |
|---|---|---|---|---|

### Tests run
| Test | Command | Result |
|---|---|---|

### Reproducibility
Same-seed runs: <identical / differ by …>. Environment: ….
```

## Quality checklist

- [ ] The review used the diff, not the agent's description of it.
- [ ] Every blocking finding was confirmed by running code, not only by reading.
- [ ] The verdict is explicit.

## Guardrails

- **Never:** accept "the agent said tests pass" as evidence; run them.
- **Never:** rewrite large parts of the code as part of a review.
- **Ask first:** before fixing code or re-running large experiments.

## Example

**Request:** "Claude added mixup to our data loader and accuracy jumped 3 points. Can I trust it?"

**Response outline:** diff shows mixup also applied in the validation loader; confirmed by printing a validation batch; blocking finding with file:line; with the fix, the gain drops to 0.4 ± 0.3; verdict "not usable until fixed".
