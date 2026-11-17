---
name: idea-to-prototype
title: Turn an idea into a working prototype
description: Break a research idea into small tasks, plan before coding, build the prototype inside the existing codebase behind a switch, debug from logs, and pass small checks before any full run.
triggers: implement this idea, build a prototype, plan the implementation, add this to the codebase, debug this training error, break this into tasks
tags: research, implementation, coding
license: MIT
author: QACI
---

# Turn an idea into a working prototype

Gets an idea running in the user's real codebase quickly without losing control of the code: a reviewed plan first, small reversible changes, and cheap checks that catch mistakes before they cost GPU hours.

## When to use

- A direction has been chosen and needs a first implementation.
- An existing prototype fails and the cause has to be found from logs.
- **Not for:** designing baselines and ablations for the paper (use `run-experiments`) or auditing code an agent already wrote (use `verify-agent-code`).

## Inputs

| Input | Required | Notes |
|---|---|---|
| The idea or hypothesis | yes | What should change in the model, data or training |
| Repository and branch | yes | Where to work; a new branch is created for the prototype |
| How the project runs today | yes | Training and evaluation commands, default config |
| Compute available | no | GPUs and time budget for test runs |

## Procedure

1. **Read before writing.** Find the entry points, the config system, the data pipeline and the exact place the idea plugs in. Summarise the flow in 5–10 lines.
   - *Check:* you can name the file and function where the change goes.
2. **Write the plan to a file.** Create `plan.md` in the branch with numbered tasks. Each task has: the change, the files it touches, how to test it, and "done when".
   - Start a fresh session for implementation once the user approves the plan, so the plan — not chat history — is the source of truth.
   - *Check:* the user approved the plan before any code changed.
3. **Implement one task at a time.** Keep each change small and on the prototype branch. Put the new behaviour behind a config flag whose default keeps today's behaviour.
   - *Check:* with the flag off, the code path is identical to before.
4. **Run small checks before big runs.**
   - unit tests for new functions with known answers;
   - shapes, dtypes and devices printed at the new code's boundaries;
   - one or two training steps on a tiny subset;
   - overfit a single batch to near-zero loss;
   - flag off reproduces the original metric on a small evaluation.
   - *Check:* each check's command and output are recorded.
5. **Debug from evidence.** When something fails, read the full stack trace and logs first. State a hypothesis for the cause, change one thing, rerun, and record what happened. Do not stack several fixes at once.
6. **Propose the full run.** Only when all small checks pass: give the exact command, config, expected duration and GPU need, and wait for approval.
7. **Update `plan.md`.** Mark tasks done, note deviations from the plan and any open questions.

## Output

```markdown
## Prototype: <idea>

**Status:** <tasks done / total>; small checks <pass/fail>; ready for full run: <yes/no>.

### Plan
<link to plan.md, with completed tasks ticked>

### Changes
| Task | Files | Flag | Test |
|---|---|---|---|

### Small checks
| Check | Command | Result |
|---|---|---|

### Debug log
- Symptom → hypothesis → change → result

### Proposed full run (waiting for approval)
`<command>` — config …, ~<hours> on <GPUs>.
```

## Quality checklist

- [ ] The plan was approved before code changed.
- [ ] Every change sits behind a flag that defaults to the old behaviour.
- [ ] Every small check lists its command and its real output.
- [ ] Nothing outside the plan's files was modified.

## Guardrails

- **Never:** delete or overwrite datasets, checkpoints or earlier results.
- **Never:** make sweeping edits outside the task's files, or reformat unrelated code.
- **Ask first:** before any run that needs more than a few minutes of GPU time, and before merging the branch.

## Example

**Request:** "Add a lead-wise attention block to our ECG classifier and see if it trains."

**Response outline:** five-line map of the model code, `plan.md` with four tasks, the block behind `model.lead_attention: false`, unit test of the block's output shape, single-batch overfit result, flag-off metric equal to baseline, proposed full-run command waiting for approval.
