# Contributing

Thank you for helping QACI Duo's Digital Workers get better at real work.

## What do you want to do?

| Goal | What to change |
|---|---|
| Add a capability | Create `playbooks/<your-playbook>/SKILL.md` from [`templates/playbook/SKILL.md`](templates/playbook/SKILL.md). To have a worker carry it, add its name under `playbooks:` in `workers/<worker>.md` and bump that worker's `release`. |
| Improve a playbook | Edit `playbooks/<name>/SKILL.md` and bump the `release` of every worker that carries it. |
| Propose a new worker | Create `workers/<your-worker>.md` from [`templates/worker.md`](templates/worker.md) and list the playbooks it carries. |

In the research workflow, **each step is one worker and each task within a step is one playbook**. More generally, a playbook is **one procedure that produces a result** — "write a rebuttal", "verify agent-written code". A worker is a
**role** that carries several playbooks — "Paper Writer". If you are describing a role, you are writing a worker.

## Steps

1. Fork the repository and create a branch.
2. Write your files following [FORMAT.md](FORMAT.md). A playbook's folder and its `name` must match; a worker's file
   name and its `id` must match.
3. Run the checks locally (Node 20 or later):

   ```sh
   npm ci --ignore-scripts
   npm test
   npm run build   # optional: writes the generated library to dist/
   ```

4. Open a pull request against `main` and complete the checklist.

## Try it before you open a pull request

- **One playbook:** paste the whole `SKILL.md` into QACI Duo under **Settings → Skills → Import a skill** (turn on
  **Advanced mode** to see *Skills*), switch it on, **Assign** it to a worker, and give the worker a real task.
- **A whole worker:** run `npm run build`, then in QACI Duo open **+ → Templates → Import** and choose (or drop) the
  generated file `dist/packages/<worker>.md`. QACI Duo shows a preview before anything is added.

## Review

| Step | Who | What happens |
|---|---|---|
| Pull request opened | Contributor | CI `validate` checks the format, the repository layout, secrets, hidden-instruction tricks, and the package generated for each worker |
| Review | Code owner (see `.github/CODEOWNERS`) | Reads the content: is the procedure correct, safe, specific, and does it stop before actions that need approval? |
| Merge to `main` | Code owner | Possible only with a green check and an approval |
| Publish | `Publish library` workflow | Regenerates the `library` branch within about a minute |
| Available in QACI Duo | Users | Visible within about five minutes (GitHub caches raw files) |

## What reviewers look for

- **Specific steps.** Each step is concrete enough for someone else to repeat and has a *Check:* line.
- **Inputs first.** The playbook says what to ask before starting, and the default when an input is missing.
- **A defined output.** The *Output* section shows the exact shape of the result.
- **Evidence.** The worker is told to cite sources and to separate verified facts from inference; it never invents
  papers, numbers or people.
- **Guardrails.** *Never* and *Ask first* lists cover sending, submitting, deleting and running costly jobs.
- **No private data.** No names of colleagues, internal projects, customer or patient data, links with credentials.
- **Plain English.** Short sentences, active voice, consistent terms.

## Commit messages

Write commit messages and pull request titles in English, in the imperative mood: "Add rebuttal playbook to Paper
Writer", "Clarify inputs of survey-a-field".
